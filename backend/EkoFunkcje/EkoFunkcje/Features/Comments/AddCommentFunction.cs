using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EkoFunkcje.Auth;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
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

namespace EkoFunkcje.Features.Comments
{
    public class AddCommentFunction
    {
        private readonly IAuth _auth;
        public AddCommentFunction(IAuth auth)
        {
            _auth = auth;
        }

        [FunctionName("AddCommentGeoHash")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "AddCommentGeoHash" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public static async Task<IActionResult> RunGeoHash(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions/{latitude}/{longitude}/{interventionId}/comments")]
            [RequestBodyType(typeof(AddCommentDto), "AddCommentDto")] HttpRequest req,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, ILogger log)
        {
            if (!_auth.IsAuthorized(req, "AddComment"))
                return new UnauthorizedResult();
            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var commentDto = JsonConvert.DeserializeObject<AddCommentDto>(content);
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            return await AddComment(
              InterventionFilterBuilder.GetInterventionGeoHashFilter(geoHash, interventionId),
              commentDto,
              interventionsTable
            );
        }

        [FunctionName("AddComment")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "AddComment" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public static async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions/{interventionId}/comments")]
          [RequestBodyType(typeof(AddCommentDto), "AddCommentDto")] HttpRequest req,
          [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
          string interventionId, ILogger log)
        {
            if (!_auth.IsAuthorized(req, "AddComment"))
                return new UnauthorizedResult();
            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var commentDto = JsonConvert.DeserializeObject<AddCommentDto>(content);
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
                
            CommentDto comment = await AddCommentToIntervention(addCommentDto, interventionsTable, intervention);
            return new JsonResult(comment);
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
            return comment;
        }
    }
}
