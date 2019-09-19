using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace EkoFunkcje.Features.Comments
{
    public static class AddCommentFunction
    {
        [FunctionName("AddComment")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "AddComment")]
            [RequestBodyType(typeof(AddCommentDto), "AddCommentDto")]AddCommentDto commentDto,
            [Table(Config.CommentsTableName, Connection = Config.StorageConnectionName)]CloudTable commentsTable,
            ILogger log)
        {
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

            CommentEntity commentEntity = new CommentEntity();
            commentEntity.InterventionId = commentDto.InterventionId;
            commentEntity.Comment = commentDto.Comment;
            TableOperation insertOperation = TableOperation.Insert(commentEntity);
            await commentsTable.ExecuteAsync(insertOperation);
            return new JsonResult("Comment Added");
        }
    }
}
