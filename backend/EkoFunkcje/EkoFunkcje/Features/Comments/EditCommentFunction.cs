using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Features.Comments
{
    public static class EditCommentFunction
    {
        [FunctionName("EditComment")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "EditComment")]
            [RequestBodyType(typeof(EditCommentRequest), "EditCommentRequest")]EditCommentRequest request,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)]CloudTable commentsTable,
            ILogger log)
        {
            var results = await commentsTable.ExecuteQuerySegmentedAsync(
                new TableQuery<CommentEntity>().Where(
                    TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, request.Id)), new TableContinuationToken());
            var requestedComment = results.Results.FirstOrDefault();
            if (requestedComment == null)
                return new StatusCodeResult(StatusCodes.Status404NotFound);

            requestedComment.Comment = request.NewValue;
            await commentsTable.ExecuteAsync(TableOperation.Merge(requestedComment));
            return new StatusCodeResult(StatusCodes.Status200OK);
        }
    }
}
