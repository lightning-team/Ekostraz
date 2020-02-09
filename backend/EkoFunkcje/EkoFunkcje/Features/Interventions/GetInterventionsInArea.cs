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
            string filter = "";
            if (Math.Abs(areaFilter.GeoLatDiff) < 0.001 && Math.Abs(areaFilter.GeoLngDiff) < 0.001)
            {
                var geoHash = GeoHasher.GetGeoHash(latitude.Replace(',','.'), longitude.Replace(',', '.'));
                filter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, geoHash);
            }
            else
            {
                string latFilterFrom = TableQuery.GenerateFilterConditionForDouble(
                    "GeoLat", QueryComparisons.GreaterThanOrEqual,
                    Convert.ToDouble(latitude) - areaFilter.GeoLatDiff);
                string latFilterTo = TableQuery.GenerateFilterConditionForDouble(
                    "GeoLat", QueryComparisons.LessThanOrEqual,
                    Convert.ToDouble(latitude) + areaFilter.GeoLatDiff);

                string latFilter = TableQuery.CombineFilters(
                    latFilterFrom,
                    TableOperators.And,
                    latFilterTo);

                string lngFilterFrom = TableQuery.GenerateFilterConditionForDouble(
                    "GeoLng", QueryComparisons.GreaterThanOrEqual,
                    Convert.ToDouble(longitude) - areaFilter.GeoLngDiff);
                string lngFilterTo = TableQuery.GenerateFilterConditionForDouble(
                    "GeoLng", QueryComparisons.LessThanOrEqual,
                    Convert.ToDouble(longitude) + areaFilter.GeoLngDiff);

                string lngFilter = TableQuery.CombineFilters(
                    lngFilterFrom,
                    TableOperators.And,
                    lngFilterTo);

                filter = TableQuery.CombineFilters(
                    latFilter,
                    TableOperators.And,
                    lngFilter);
            }

            TableContinuationToken token = null;

            var entities = new List<InterventionListItemResponse>();
            do
            {
                var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(filter), token);
                entities.AddRange(queryResult.Results.Select(x => _mapper.Map<InterventionListItemResponse>(x)));
                token = queryResult.ContinuationToken;
            } while (token != null);

            var filteredEntities = entities.Where(x => areaFilter.Statuses.Contains(x.Status));

            return new JsonResult(filteredEntities);
        }
    }
}
