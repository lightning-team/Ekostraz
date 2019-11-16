using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Respones;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Features.Interventions
{
    public class GetAllInterventionsFunction
    {
        private readonly IMapper _mapper;

        public GetAllInterventionsFunction()
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionListItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.RowKey)));
            _mapper = config.CreateMapper();
        }

        //TODO okreslic po jakich filtrach bedą pobierane interwencje dla widoku listy
        [FunctionName("GetAllInterventions")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions")] HttpRequest req,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable cloudTable,
            ILogger log)
        {
            TableQuery<InterventionEntity> rangeQuery = new TableQuery<InterventionEntity>().Select(new List<string>() { "RowKey", "GeoLat", "GeoLng" }).Take(100);

            TableContinuationToken token = null;
            var entities = new List<InterventionListItemResponse>();
            do
            {
                var queryResult = await cloudTable.ExecuteQuerySegmentedAsync(rangeQuery, token);
                entities.AddRange(queryResult.Results.Select(x => _mapper.Map<InterventionListItemResponse>(x)));
                token = queryResult.ContinuationToken;
            } while (token != null);

            return new JsonResult(entities);
        }
    }
}
