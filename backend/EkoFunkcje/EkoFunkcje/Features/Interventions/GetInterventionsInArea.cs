using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EkoFunkcje.Auth;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Requests;
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
using Newtonsoft.Json;

namespace EkoFunkcje.Features.Interventions
{

    public class GetInterventionsInArea
    {
        private readonly IMapper _mapper;
        private readonly IAuth _auth;

        public GetInterventionsInArea(IAuth auth)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionListItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.RowKey)));
            _mapper = config.CreateMapper();
            _auth = auth;
        }

        [FunctionName("GetInterventionsInArea")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "GetInterventionsInArea" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{latitude}/{longitude}")]
            HttpRequest request,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, ILogger log)
        {
            // FIXME: The function might not work properly for multiple statuses, please recheck and adjust. See "GetAllInterventionsFunction" for a similar case.
            if (!_auth.IsAuthorized(request, "GetInterventionsInArea"))
                return new UnauthorizedResult();
            var body = await request.ReadAsStringAsync();
            var areaFilter = JsonConvert.DeserializeObject<AreaInterventionsFilterRequest>(body);
            string filter = GetFilter(areaFilter, latitude, longitude);
            var interventions = (await GetFilteredInterventions(areaFilter.Statuses, interventionsTable, filter)).ToList();
            var result = new
            {
                totalCount = interventions.Count(),
                results = interventions
            };
            return new JsonResult(result);
        }

        private async Task<IEnumerable<InterventionListItemResponse>> GetFilteredInterventions(
            List<InterventionStatus> requestStatuses, CloudTable interventionsTable, string filter
        ) {
            TableContinuationToken token = null;

            var interventions = new List<InterventionListItemResponse>();
            do
            {
                var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(filter), token);
                interventions.AddRange(queryResult.Results.Select(x => _mapper.Map<InterventionListItemResponse>(x)));
                token = queryResult.ContinuationToken;
            } while (token != null);

            return interventions.Where(intervention => requestStatuses.Contains(intervention.Status));
        }

        private static string GetFilter(AreaInterventionsFilterRequest areaFilter, string latitude, string longitude)
        {
            bool shouldUseGeoHashFilter = Math.Abs(areaFilter.GeoLatDiff) < 0.001 && Math.Abs(areaFilter.GeoLngDiff) < 0.001;
            if (shouldUseGeoHashFilter)
            {
                string geoHash = GeoHasher.GetGeoHash(latitude, longitude);
                return InterventionFilterBuilder.GetGeoHashFilter(geoHash);
            } else {
                return InterventionFilterBuilder.GetAreaFilter(latitude, longitude, areaFilter.GeoLatDiff, areaFilter.GeoLngDiff);
            }
        }
    }
}
