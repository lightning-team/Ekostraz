using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
using EkoFunkcje.Models.Requests;
using EkoFunkcje.Models.Respones;
using EkoFunkcje.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using NGeoHash;

namespace EkoFunkcje.Features.Interventions
{

    public class GetInterventionsInArea
    {
        private readonly IMapper _mapper;

        public GetInterventionsInArea()
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionListItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.RowKey)));
            _mapper = config.CreateMapper();
        }

        [FunctionName("GetInterventionsInArea")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{latitude}/{longitude}")]
            [RequestBodyType(typeof(AreaInterventionsFilterRequest), "AreaInterventionsFilterRequest")]AreaInterventionsFilterRequest areaFilter,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, ILogger log)
        {
            string filter = GetFilter(areaFilter, latitude, longitude);
            var interventions = await GetFilteredInterventions(areaFilter.Statuses, interventionsTable, filter);
            return new JsonResult(interventions);
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

            return  interventions.Where(intervention => requestStatuses.Contains(intervention.Status));
        }

        private static string GetFilter(AreaInterventionsFilterRequest areaFilter, string latitude, string longitude)
        {
            bool shouldUseGeoHashFilter =   Math.Abs(areaFilter.GeoLatDiff) < 0.001 && 
                                            Math.Abs(areaFilter.GeoLngDiff) < 0.001;
            if (shouldUseGeoHashFilter)
            {
                string geoHash = GeoHasher.GetGeoHash(latitude.Replace(',', '.'), longitude.Replace(',', '.'));
                return InterventionFilterBuilder.GetGeoHashFilter(geoHash);
            } else {
                return InterventionFilterBuilder.GetAreaFilter(latitude, longitude, areaFilter.GeoLatDiff, areaFilter.GeoLngDiff);
            }
        }
    }
}
