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
            [Table(Config.CommentsTableName, Connection = Config.StorageConnectionName)]CloudTable cloudTable,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            var results = new List<ValidationResult>();
            if (!Validator.TryValidateObject(commentDto, new ValidationContext(commentDto, null, null), results, true))
            {

                var errorList = new List<string>();
                foreach (var error in results)
                {
                    errorList.Add(error.ErrorMessage);
                }
                string json = JsonConvert.SerializeObject(errorList);
                return new BadRequestObjectResult(json);
            }
            // I'm not sure if the best option is to create an extra table for comments only -> maybe extra column in Interventions will be fine
            CommentEntity commentEntity = new CommentEntity(commentDto.InterventionId);
            commentEntity.Comment = commentDto.Comment;
            TableOperation insertOperation = TableOperation.Insert(commentEntity);
            await cloudTable.ExecuteAsync(insertOperation);
            return new JsonResult($"Data Added");
        }
    }
}
