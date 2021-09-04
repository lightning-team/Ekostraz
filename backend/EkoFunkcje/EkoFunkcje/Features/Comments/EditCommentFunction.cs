using EkoFunkcje.Auth;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Requests;
using EkoFunkcje.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EkoFunkcje.Features.Comments
{
    public class EditCommentFunction
    {
        private readonly IAuth _auth;
        public EditCommentFunction(IAuth auth)
        {
            _auth = auth;
        }
        [FunctionName("EditCommentGeoHash")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "EditCommentGeoHash" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<IActionResult> RunGeoHash(
            [HttpTrigger(AuthorizationLevel.Function, "patch", Route = "interventions/{latitude}/{longitude}/{interventionId}/comments/{commentId}")]
            /*[RequestBodyType(typeof(EditCommentRequest), "EditCommentRequest")]*/HttpRequest req,
        [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, string commentId, ILogger log)
        {
            if (!_auth.IsAuthorized(req, "EditComment"))
                return new UnauthorizedResult();
            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var editCommentRequest = JsonConvert.DeserializeObject<EditCommentRequest>(content);
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            var finalFilter = InterventionFilterBuilder.GetInterventionGeoHashFilter(geoHash, interventionId);

            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                finalFilter).Take(1), null); 
            
            var requestedIntervention = queryResult.Results.FirstOrDefault();
            if (requestedIntervention == null)
                return new StatusCodeResult(StatusCodes.Status404NotFound);

            try
            {
                requestedIntervention.EditComment(commentId, editCommentRequest.NewValue);
                await interventionsTable.ExecuteAsync(TableOperation.Merge(requestedIntervention));
            }
            catch (InvalidOperationException e)
            {
                return new StatusCodeResult(StatusCodes.Status404NotFound);
            }
            
            return new StatusCodeResult(StatusCodes.Status200OK);

        }

        [FunctionName("EditComment")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "EditComment" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Function, "patch", Route = "interventions/{interventionId}/comments/{commentId}")]
          /*[RequestBodyType(typeof(EditCommentRequest), "EditCommentRequest")]*/HttpRequest req,
          [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
          string interventionId, string commentId, ILogger log)
        {
            if (!_auth.IsAuthorized(req, "EditComment"))
                return new UnauthorizedResult();
            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var editCommentRequest = JsonConvert.DeserializeObject<EditCommentRequest>(content);
            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
            TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionId)).Take(1), null);

          var requestedIntervention = queryResult.Results.FirstOrDefault();
          if (requestedIntervention == null)
            return new StatusCodeResult(StatusCodes.Status404NotFound);

          try
          {
            requestedIntervention.EditComment(commentId, editCommentRequest.NewValue);
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
