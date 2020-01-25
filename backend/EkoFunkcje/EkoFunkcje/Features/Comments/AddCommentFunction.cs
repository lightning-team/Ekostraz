using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
using EkoFunkcje.Utils;
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
        [FunctionName("AddCommentGeoHash")]
        public static async Task<IActionResult> RunGeoHash(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions/{latitude}/{longitude}/{interventionId}/comments")]
            [RequestBodyType(typeof(AddCommentDto), "AddCommentDto")]AddCommentDto commentDto,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, ILogger log)
        {
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            var finalFilter = InterventionFilterBuilder.GetInterventionFilter(geoHash, interventionId);

            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                finalFilter).Take(1), null); 
            
            var requestedIntervention = queryResult.Results.FirstOrDefault();
            if (requestedIntervention == null)
                return new StatusCodeResult(StatusCodes.Status404NotFound);

            requestedIntervention.AddComment(new CommentDto()
            {
                CreatedDate = DateTime.UtcNow,
                Comment = commentDto.Comment,
                Id = Guid.NewGuid().ToString()
            });

            await interventionsTable.ExecuteAsync(TableOperation.Merge(requestedIntervention));
            return new StatusCodeResult(StatusCodes.Status200OK);
        }

        [FunctionName("AddComment")]
        public static async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions/{interventionId}/comments")]
          [RequestBodyType(typeof(AddCommentDto), "AddCommentDto")]AddCommentDto commentDto,
          [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
          string interventionId, ILogger log)
        {
          
          var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
            TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionId)).Take(1), null);

          var requestedIntervention = queryResult.Results.FirstOrDefault();
          if (requestedIntervention == null)
            return new StatusCodeResult(StatusCodes.Status404NotFound);

          requestedIntervention.AddComment(new CommentDto()
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
