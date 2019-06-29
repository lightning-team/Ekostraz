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

namespace EkoFunkcje
{
    public static class AddPublicFormFunction
    {
        [FunctionName("AddPublicForm")]
        public static async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] PrivateInterventionDto intervention,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            var storageAccountConnectionString = Environment.GetEnvironmentVariable("StorageAccountConnectionString", EnvironmentVariableTarget.Process);
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageAccountConnectionString);

            // Create the table client.
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

            CloudTable interventionTable = tableClient.GetTableReference("Intervention");
            await interventionTable.CreateIfNotExistsAsync();
            InterventionEntity interventionEntity = new InterventionEntity(intervention.Email);
            interventionEntity.Email = intervention.Email;
            interventionEntity.Adress = intervention.Adress;
            interventionEntity.CreationDate = DateTime.UtcNow;
            interventionEntity.Description = intervention.Description;
            interventionEntity.FullName = intervention.FullName;
            interventionEntity.PhoneNumber = intervention.PhoneNumber;
            interventionEntity.Status = InterventionStatus.ActionRequired.ToString();

            TableOperation insertOperation = TableOperation.Insert(interventionEntity);

            // Execute the insert operation.
            await interventionTable.ExecuteAsync(insertOperation);


            return new OkObjectResult($"Data Added");
            //  : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
        }

    }
}
