using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Respones;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;
using NGeoHash;

namespace EkoFunkcje.Features.Interventions
{
    public class GetOneInterventionFunction
    {
        private IMapper _mapper;
        public GetOneInterventionFunction()
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.RowKey)));
            _mapper = config.CreateMapper();
        }

        [FunctionName("GetOneIntervention")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "interventions/{latitude}/{longitude}/{interventionId}")] HttpRequestMessage req,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, ILogger log)
        {
            var geoHash = GeoHash.Encode(double.Parse(latitude), double.Parse(longitude), Config.GeoHashPrecision);

            string geoHashFilter = TableQuery.GenerateFilterCondition(
                "PartitionKey", QueryComparisons.Equal,
                geoHash);
            string idFilter = TableQuery.GenerateFilterCondition(
                "RowKey", QueryComparisons.Equal,
                interventionId);

            string finalFilter = TableQuery.CombineFilters(
                    geoHashFilter,
                    TableOperators.And,
                    idFilter);

            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                finalFilter).Take(1), null);
            var interventionItemResponses = queryResult.Results.Select(x => _mapper.Map<InterventionItemResponse>(x)).FirstOrDefault();

            return new JsonResult(interventionItemResponses);
        }
    }
}
