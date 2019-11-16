using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
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
    public class GetOneInterventionFunction
    {
        private IMapper _mapper;
        public GetOneInterventionFunction()
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.RowKey))
                .ForMember(dest => dest.Comments,
                    opts => opts.MapFrom(src => src.GetComments())));
            _mapper = config.CreateMapper();
        }

        [FunctionName("GetOneIntervention")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{latitude}/{longitude}/{interventionId}")] HttpRequestMessage req,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, ILogger log)
        {
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            var finalFilter = InterventionFilterBuilder.GetInterventionFilter(geoHash, interventionId);

            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                finalFilter).Take(1), null);
            var interventionItemResponses = queryResult.Results.Select(x => _mapper.Map<InterventionItemResponse>(x)).FirstOrDefault();

            return new JsonResult(interventionItemResponses);
        }
    }
}
