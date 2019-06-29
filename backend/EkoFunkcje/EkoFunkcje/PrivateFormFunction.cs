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
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

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
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=ekoststorage;AccountKey=I4+b0+vmOhZcbc4fVlxhHUlU0YQNFGaQcfG2kilxxtvftSynVCdmUEg47Y1iG2Z5qG1G/rHo4+QhOSSXN2YanQ==;EndpointSuffix=core.windows.net");
                //ToDo get string from  env data

                var convertedGeoAddress = await new AddressConverter().ConvertToGeoAddress(intervention.Adress);
                // Create the table client.
                CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

                CloudTable interventionTable = tableClient.GetTableReference("Intervention");
                await interventionTable.CreateIfNotExistsAsync();
                InterventionEntity interventionEntity = new InterventionEntity(intervention.Email);
                interventionEntity.Email = intervention.Email;
                interventionEntity.Address = intervention.Adress;
                interventionEntity.CreationDate = DateTime.UtcNow;
                interventionEntity.Description = intervention.Description;
                interventionEntity.FullName = intervention.FullName;
                interventionEntity.PhoneNumber = intervention.PhoneNumber;
                interventionEntity.Status = InterventionStatus.ActionRequired.ToString();
                interventionEntity.GeoLat = convertedGeoAddress.lat;
                interventionEntity.GeoLng = convertedGeoAddress.lng;


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


                return new OkObjectResult($"Data Added");
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
