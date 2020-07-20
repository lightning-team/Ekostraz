using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Auth;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Requests;
using EkoFunkcje.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EkoFunkcje.Features.Comments
{
    public class DeleteCommentFunction
    {
        private readonly IAuth _auth;
        public DeleteCommentFunction(IAuth auth)
        {
            _auth = auth;
        }

        [FunctionName("DeleteCommentGeoHash")]
        public async Task<IActionResult> RunGeoHash(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "interventions/{latitude}/{longitude}/{interventionId}/comments/{commentId}")]
            [RequestBodyType(typeof(DeletionRequest), "DeletionRequest")]HttpRequest req,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, string commentId, ILogger log)
        {
            if (!_auth.IsAuthorized(req, "DeleteComment"))
                return new UnauthorizedResult();
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
        public async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "interventions/{interventionId}/comments/{commentId}")]
          [RequestBodyType(typeof(DeletionRequest), "DeletionRequest")]HttpRequest req,
          [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
          string interventionId, string commentId, ILogger log)
        {
            if (!_auth.IsAuthorized(req, "DeleteComment"))
                return new UnauthorizedResult();
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
