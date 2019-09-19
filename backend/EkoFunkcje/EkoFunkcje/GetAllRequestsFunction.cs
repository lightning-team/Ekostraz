using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EkoFunkcje
{
    public class GetAllRequestsFunction
    {
        private readonly IMapper _mapper;

        public GetAllRequestsFunction()
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionListItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.RowKey)));
            _mapper = config.CreateMapper();
        }
        [FunctionName("GetAllRequestsFunction")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
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
