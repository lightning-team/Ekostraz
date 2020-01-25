using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Requests;
using EkoFunkcje.Utils;
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
        [FunctionName("EditCommentGeoHash")]
        public static async Task<IActionResult> RunGeoHash(
            [HttpTrigger(AuthorizationLevel.Function, "patch", Route = "interventions/{latitude}/{longitude}/{interventionId}/comments/{commentId}")]
            [RequestBodyType(typeof(EditCommentRequest), "EditCommentRequest")]EditCommentRequest request,
        [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, string commentId, ILogger log)
        {
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            var finalFilter = InterventionFilterBuilder.GetInterventionFilter(geoHash, interventionId);

            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                finalFilter).Take(1), null); 
            
            var requestedIntervention = queryResult.Results.FirstOrDefault();
            if (requestedIntervention == null)
                return new StatusCodeResult(StatusCodes.Status404NotFound);

            try
            {
                requestedIntervention.EditComment(commentId, request.NewValue);
                await interventionsTable.ExecuteAsync(TableOperation.Merge(requestedIntervention));
            }
            catch (InvalidOperationException e)
            {
                return new StatusCodeResult(StatusCodes.Status404NotFound);
            }
            
            return new StatusCodeResult(StatusCodes.Status200OK);

        }

        [FunctionName("EditComment")]
        public static async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Function, "patch", Route = "interventions/{interventionId}/comments/{commentId}")]
          [RequestBodyType(typeof(EditCommentRequest), "EditCommentRequest")]EditCommentRequest request,
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
            requestedIntervention.EditComment(commentId, request.NewValue);
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
