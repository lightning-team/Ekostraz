using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EkoFunkcje.Models;
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
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{latitude}/{longitude}")] HttpRequestMessage req,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, ILogger log)
        {
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            TableContinuationToken token = null;

            var entities = new List<InterventionListItemResponse>();
            do
            {
                var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                    TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, geoHash)), null);
                entities.AddRange(queryResult.Results.Select(x => _mapper.Map<InterventionListItemResponse>(x)));
                token = queryResult.ContinuationToken;
            } while (token != null);

            return new JsonResult(entities);
        }
    }
}
