using AutoMapper;
using EkoFunkcje.Auth;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Respones;
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
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace EkoFunkcje.Features.Interventions
{
    public class GetOneInterventionFunction
    {
        private IMapper _mapper;
        private readonly IAuth _auth;
        public GetOneInterventionFunction(IAuth auth)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.RowKey))
                .ForMember(dest => dest.Comments,
                    opts => opts.MapFrom(src => src.GetComments())));
            _mapper = config.CreateMapper();
            _auth = auth;
        }

        [FunctionName("GetOneInterventionGeoHash")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "GetOneInterventionGeoHash" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<IActionResult> RunWithGeoHash(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{latitude}/{longitude}/{interventionId}")] HttpRequest req,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, ILogger log)
        {
            if (!_auth.IsAuthorized(req, "GetOneInterventionGeoHash"))
                return new UnauthorizedResult();
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            var finalFilter = InterventionFilterBuilder.GetInterventionGeoHashFilter(geoHash, interventionId);

            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                finalFilter).Take(1), null);
            var interventionItemResponses = queryResult.Results.FirstOrDefault();

            if (interventionItemResponses != null)
            {
                return new JsonResult(_mapper.Map<InterventionItemResponse>(interventionItemResponses));
            }

            return new StatusCodeResult(StatusCodes.Status404NotFound);
        }

        [FunctionName("GetOneIntervention")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "GetOneIntervention" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{interventionId}")] HttpRequestMessage req,
          [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
          string interventionId, ILogger log)
        {
          var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
            TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionId)).Take(1), null);
          var interventionItemResponses = queryResult.Results.FirstOrDefault();

          if (interventionItemResponses != null)
          {
              return new JsonResult(_mapper.Map<InterventionItemResponse>(interventionItemResponses));
          }

          return new StatusCodeResult(StatusCodes.Status404NotFound);
        }
  }
}
