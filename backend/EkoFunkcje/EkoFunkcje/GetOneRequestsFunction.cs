using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EkoFunkcje.Models;

namespace EkoFunkcje
{
    public static class GetOneRequestsFunction
    {
        [FunctionName("GetOneRequestsFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] IdReqest reqest,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.PartitionKey)));
            var mapperIntervention = config.CreateMapper();

            var mapperComments = new MapperConfiguration(cfg => cfg
                .CreateMap<CommentEntity, InterventionItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.PartitionKey))).CreateMapper();

            var storageAccountConnectionString = Environment.GetEnvironmentVariable("StorageAccountConnectionString", EnvironmentVariableTarget.Process);
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageAccountConnectionString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            CloudTable interventionTable = tableClient.GetTableReference("Intervention");

            var queryResult = await interventionTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, reqest.Id)), null);
            //tylko 1 
            var interventionItemResponses = queryResult.Results.Select(x => mapperIntervention.Map<InterventionItemResponse>(x)).FirstOrDefault();

            TableContinuationToken token = null;
            CloudTable commentsTable = tableClient.GetTableReference("Comments");
            var entities = new List<string>();
            do
            {
                var result = await commentsTable.ExecuteQuerySegmentedAsync(new TableQuery<CommentEntity>().Where(
                    TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionItemResponses.Id)), token);
                result.Results.ForEach(entity => entities.Add(entity.Comment));
                token = result.ContinuationToken;
            } while (token != null);

            interventionItemResponses.Comments = entities;

            return new JsonResult(interventionItemResponses);
        }

        public class IdReqest
        {
            public string Id { get; set; }
        }
    }
}
