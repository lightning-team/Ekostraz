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
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.Extensions.Logging;

namespace EkoFunkcje.Features.Comments
{
    public static class DeleteCommentFunction
    {
        [FunctionName("DeleteComment")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "interventions/{interventionId}/comments/{commentId}")]
            [RequestBodyType(typeof(DeletionRequest), "DeletionRequest")]DeletionRequest request,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string interventionId, string commentId, ILogger log)
        {
            var results = await interventionsTable.ExecuteQuerySegmentedAsync(
                new TableQuery<InterventionEntity>().Where(
                    TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionId)), new TableContinuationToken());
            var requestedIntervention = results.Results.FirstOrDefault();
            if (requestedIntervention == null)
                return new StatusCodeResult(StatusCodes.Status404NotFound);

            var commentToRemove = requestedIntervention.Comments.FirstOrDefault(x => x.Id == commentId);
            if (commentToRemove != null)
            {
                requestedIntervention.Comments.Remove(commentToRemove);
                await interventionsTable.ExecuteAsync(TableOperation.Merge(requestedIntervention));
                return new StatusCodeResult(StatusCodes.Status200OK);
            }
            return new StatusCodeResult(StatusCodes.Status404NotFound);
        }
    }
}
