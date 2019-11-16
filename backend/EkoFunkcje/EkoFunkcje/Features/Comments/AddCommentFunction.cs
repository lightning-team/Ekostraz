using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
using Microsoft.AspNetCore.Http;
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
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "interventions/{interventionId}/comments")]
            [RequestBodyType(typeof(AddCommentDto), "AddCommentDto")]AddCommentDto commentDto,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string interventionId, ILogger log)
        {
            var results = await interventionsTable.ExecuteQuerySegmentedAsync(
                new TableQuery<InterventionEntity>().Where(
                    TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionId)), new TableContinuationToken());
            var requestedIntervention = results.Results.FirstOrDefault();
            if (requestedIntervention == null)
                return new StatusCodeResult(StatusCodes.Status404NotFound);

            requestedIntervention.Comments.Add(new CommentDto()
            {
                CreatedDate = DateTime.UtcNow,
                Comment = commentDto.Comment,
                Id = Guid.NewGuid().ToString()
            });

            await interventionsTable.ExecuteAsync(TableOperation.Merge(requestedIntervention));
            return new StatusCodeResult(StatusCodes.Status200OK);
        }
    }
}
