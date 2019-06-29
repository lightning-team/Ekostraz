using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.WindowsAzure.Storage.Table;
using AutoMapper;
using Microsoft.WindowsAzure.Storage;
using System.Collections.Generic;
using System.Linq;

namespace EkoFunkcje
{
    public static class GetAllRequestsFunction
    {
        [FunctionName("GetAllRequestsFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionListItemDto>());
            var mapper = config.CreateMapper();

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=ekoststorage;AccountKey=I4+b0+vmOhZcbc4fVlxhHUlU0YQNFGaQcfG2kilxxtvftSynVCdmUEg47Y1iG2Z5qG1G/rHo4+QhOSSXN2YanQ==;EndpointSuffix=core.windows.net");
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            CloudTable interventionTable = tableClient.GetTableReference("Intervention");

            string name = req.Query["name"];

            TableContinuationToken token = null;
            var entities = new List<InterventionListItemDto>();
            do
            {
                var queryResult = await interventionTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>(), token);
                entities.AddRange(queryResult.Results.Select(x => mapper.Map<InterventionListItemDto>(x)));
                token = queryResult.ContinuationToken;
            } while (token != null);

            return new JsonResult(entities);
        }
    }
}
