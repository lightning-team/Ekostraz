using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Requests;
using EkoFunkcje.Utils;
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
        [FunctionName("DeleteCommentGeoHash")]
        public static async Task<IActionResult> RunGeoHash(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "interventions/{latitude}/{longitude}/{interventionId}/comments/{commentId}")]
            DeletionRequest request,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, string commentId, ILogger log)
        {
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            var finalFilter = InterventionFilterBuilder.GetInterventionGeoHashFilter(geoHash, interventionId);

            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                finalFilter).Take(1), null); 
            
            var requestedIntervention = queryResult.Results.FirstOrDefault();
            if (requestedIntervention == null)
                return new StatusCodeResult(StatusCodes.Status404NotFound);

            try
            {
                requestedIntervention.DeleteComment(commentId);
                await interventionsTable.ExecuteAsync(TableOperation.Merge(requestedIntervention));

            }
            catch (InvalidOperationException e)
            {
                return new StatusCodeResult(StatusCodes.Status404NotFound);
            }

            return new StatusCodeResult(StatusCodes.Status200OK);
        }

        [FunctionName("DeleteComment")]
        public static async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "interventions/{interventionId}/comments/{commentId}")]
          DeletionRequest request,
          [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
          string interventionId, string commentId, ILogger log)
        {
          var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
            TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionId)).Take(1), null);

          var requestedIntervention = queryResult.Results.FirstOrDefault();
          if (requestedIntervention == null)
            return new StatusCodeResult(StatusCodes.Status404NotFound);

          try
          {
            requestedIntervention.DeleteComment(commentId);
            await interventionsTable.ExecuteAsync(TableOperation.Merge(requestedIntervention));

          }
          catch (InvalidOperationException e)
          {
            return new StatusCodeResult(StatusCodes.Status404NotFound);
          }

          return new StatusCodeResult(StatusCodes.Status200OK);
        }
    }
}
