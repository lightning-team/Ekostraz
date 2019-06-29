    using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Threading.Tasks;

namespace EkoFunkcje
{
    public static class AddPublicFormFunction
    {
        [FunctionName("AddPublicForm")]
        public static async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] InterventionDto intervention,
            ILogger log)
        {

            log.LogInformation("C# HTTP trigger function processed a request.");
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=ekoststorage;AccountKey=I4+b0+vmOhZcbc4fVlxhHUlU0YQNFGaQcfG2kilxxtvftSynVCdmUEg47Y1iG2Z5qG1G/rHo4+QhOSSXN2YanQ==;EndpointSuffix=core.windows.net");
            //ToDo get string from  env data

            // Create the table client.
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

            CloudTable interventionTable = tableClient.GetTableReference("Intervention");
            await interventionTable.CreateIfNotExistsAsync();
            InterventionEntity interventionEntity = new InterventionEntity(intervention.Email);
            interventionEntity.Email = intervention.Email;
            interventionEntity.Adres = intervention.Adres;
            interventionEntity.CreationDate = DateTime.UtcNow;
            interventionEntity.Description = intervention.Description;
            interventionEntity.FullName = intervention.FullName;
            interventionEntity.PhoneNumber = intervention.PhoneNumber;
            interventionEntity.Status = InterventionStatus.ActionRequired.ToString();

            TableOperation insertOperation = TableOperation.Insert(interventionEntity);

            // Execute the insert operation.
            await interventionTable.ExecuteAsync(insertOperation);


            return new OkObjectResult($"Hello");
              //  : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
        }

    }
}
