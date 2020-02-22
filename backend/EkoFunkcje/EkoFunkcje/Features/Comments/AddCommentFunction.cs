using System;
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

namespace EkoFunkcje.Features.Comments
{
    public static class AddCommentFunction
    {
        [FunctionName("AddCommentGeoHash")]
        public static async Task<IActionResult> RunGeoHash(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions/{latitude}/{longitude}/{interventionId}/comments")]
            [RequestBodyType(typeof(AddCommentDto), "AddCommentDto")] AddCommentDto commentDto,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, ILogger log)
        {
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            return await AddComment(
              InterventionFilterBuilder.GetInterventionGeoHashFilter(geoHash, interventionId),
              commentDto,
              interventionsTable
            );
        }

        [FunctionName("AddComment")]
        public static async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions/{interventionId}/comments")]
          [RequestBodyType(typeof(AddCommentDto), "AddCommentDto")] AddCommentDto commentDto,
          [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
          string interventionId, ILogger log)
        {
          return await AddComment(
            InterventionFilterBuilder.GetByIdFilter(interventionId),
            commentDto,
            interventionsTable
          );
        }

        private static async Task<IActionResult> AddComment(
          string filter, AddCommentDto addCommentDto, CloudTable interventionsTable
          ) {
            InterventionEntity intervention = await GetIntervention(filter, interventionsTable);
            if (intervention == null)
                return new StatusCodeResult(StatusCodes.Status404NotFound);
                
            await AddCommentToIntervention(addCommentDto, interventionsTable, intervention);
            return new new StatusCodeResult(StatusCodes.Status200OK);;
        }

        private static async Task<InterventionEntity> GetIntervention(string filter, CloudTable interventionsTable)
        {
            var query = new TableQuery<InterventionEntity>().Where(filter).Take(1);
            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(query, null);
            var requestedIntervention = queryResult.Results.FirstOrDefault();
            return requestedIntervention;
        }

        private static async Task<CommentDto> AddCommentToIntervention(
          AddCommentDto addCommentDto, CloudTable interventionsTable, InterventionEntity intervention
        ){
            CommentDto comment = new CommentDto()
            {
                CreatedDate = DateTime.UtcNow,
                Comment = addCommentDto.Comment,
                Id = Guid.NewGuid().ToString()
            };
            intervention.AddComment(comment);
            await interventionsTable.ExecuteAsync(TableOperation.Merge(intervention));
        }
    }
}
