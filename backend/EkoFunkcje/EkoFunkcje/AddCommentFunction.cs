using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
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
    public static class AddCommentFunction
    {
        [FunctionName("AddCommentFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] AddCommentDto commentDto,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            var results = new List<ValidationResult>();
            if (Validator.TryValidateObject(commentDto, new ValidationContext(commentDto, null, null), results, true))
            {

                var storageAccountConnectionString = Environment.GetEnvironmentVariable("StorageAccountConnectionString",
                    EnvironmentVariableTarget.Process);
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageAccountConnectionString);

                // Create the table client.
                CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

                CloudTable commentsTable = tableClient.GetTableReference("Comments");
                await commentsTable.CreateIfNotExistsAsync();
                CommentEntity commentEntity = new CommentEntity(commentDto.InterventionId);
                commentEntity.Comment = commentDto.Comment;

                TableOperation insertOperation = TableOperation.Insert(commentEntity);

                await commentsTable.ExecuteAsync(insertOperation);

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
