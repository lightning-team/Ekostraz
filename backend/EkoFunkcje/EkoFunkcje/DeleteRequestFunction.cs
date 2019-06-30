using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace EkoFunkcje
{
    public static class DeleteRequestFunction
    {
        [FunctionName("DeleteRequestFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] DeletionRequest request,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var storageAccountConnectionString = Environment.GetEnvironmentVariable("StorageAccountConnectionString", EnvironmentVariableTarget.Process);
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageAccountConnectionString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            CloudTable interventionTable = tableClient.GetTableReference("Intervention");

            TableOperation retrieveOperation = TableOperation.Retrieve<InterventionEntity>(request.PartitionKey, request.RowKey);
            TableResult retrievedResult = await interventionTable.ExecuteAsync(retrieveOperation);
            InterventionEntity deleteEntity = (InterventionEntity)retrievedResult.Result;

            if (deleteEntity != null)
            {
                TableOperation deleteOperation = TableOperation.Delete(deleteEntity);
                await interventionTable.ExecuteAsync(deleteOperation);
                return new OkResult();
            }

            return new BadRequestResult();
        }

        public class DeletionRequest
        {
            public string PartitionKey { get; set; }
            public string RowKey { get; set; }
        }
    }

}
