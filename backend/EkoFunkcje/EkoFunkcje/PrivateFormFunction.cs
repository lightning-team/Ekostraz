using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace EkoFunkcje
{
    public static class PrivateFormFunction
    {
        [FunctionName("PrivateForm")]
        public static async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] PrivateInterventionDto intervention,
            ILogger log)
        {

            var results = new List<ValidationResult>();
            if (Validator.TryValidateObject(intervention, new ValidationContext(intervention, null, null), results, true))
            {
                log.LogInformation("C# HTTP trigger function processed a request.");
                
                var storageAccountConnectionString = Environment.GetEnvironmentVariable("StorageAccountConnectionString",
                    EnvironmentVariableTarget.Process);
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageAccountConnectionString);


                var convertedGeoAddress = await new AddressConverter().ConvertToGeoAddress(intervention.Address);
                // Create the table client.
                CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

                CloudTable interventionTable = tableClient.GetTableReference("Intervention");
                await interventionTable.CreateIfNotExistsAsync();
                InterventionEntity interventionEntity = new InterventionEntity(intervention.PhoneNumber)
                {
                    Email = intervention.Email,
                    Address = intervention.Address,
                    CreationDate = DateTime.UtcNow,
                    Description = intervention.Description,
                    FullName = intervention.FullName,
                    PhoneNumber = intervention.PhoneNumber,
                    Status = InterventionStatus.ActionRequired.ToString(),
                    GeoLat = convertedGeoAddress.lat,
                    GeoLng = convertedGeoAddress.lng
                };


                switch (intervention.Status)
                {
                    case "ToVerify":
                        interventionEntity.Status = InterventionStatus.ToVerify.ToString();
                        break;
                    case "ActionRequired":
                        interventionEntity.Status = InterventionStatus.ActionRequired.ToString();
                        break;
                    case "InProgress":
                        interventionEntity.Status = InterventionStatus.InProgress.ToString();
                        break;
                    case "Closed":
                        interventionEntity.Status = InterventionStatus.Closed.ToString();
                        break;
                    default:
                        //todo error
                        break;
                }

                TableOperation insertOperation = TableOperation.InsertOrMerge(interventionEntity);

                // Execute the insert operation.
                await interventionTable.ExecuteAsync(insertOperation);


                return new JsonResult($"Data Added");
            }
            else
            {
                var errorList = new List<string>();
                foreach (var error in results)
                {
                    errorList.Add(error.ErrorMessage);
                }
                string json = JsonConvert.SerializeObject(errorList);
                return new BadRequestObjectResult(json);
            }

        }

    }
}
