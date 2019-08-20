using AutoMapper;
using Microsoft.AspNetCore.Http;
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

namespace EkoFunkcje
{
    public static class GetAllGeoDataFunction
    {
        [FunctionName("GetAllGeoDataFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, GeoListItemResponse>()
                .ForMember(dest => dest.InterventionId,
                    opts => opts.MapFrom(src => src.PartitionKey)));
            var mapper = config.CreateMapper();

            var storageAccountConnectionString = Environment.GetEnvironmentVariable("StorageAccountConnectionString", EnvironmentVariableTarget.Process);
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageAccountConnectionString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            CloudTable interventionTable = tableClient.GetTableReference("Intervention");

            TableContinuationToken token = null;
            var entities = new List<GeoListItemResponse>();
            do
            {
                var queryResult = await interventionTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>(), token);
                entities.AddRange(queryResult.Results.Select(x => mapper.Map<GeoListItemResponse>(x)));
                token = queryResult.ContinuationToken;
            } while (token != null);

            return new JsonResult(entities);
        }
    }
}