using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Respones;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;

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
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] IdReqest reqest,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable commentsTable,
            ILogger log)
        {
            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, reqest.Id)).Take(1), null);
            var interventionItemResponses = queryResult.Results.Select(x => _mapper.Map<InterventionItemResponse>(x)).FirstOrDefault();

            TableContinuationToken token = null;

            if (interventionItemResponses != null)
            {
                var entities = new List<string>();
                do
                {
                    var result = await commentsTable.ExecuteQuerySegmentedAsync(new TableQuery<CommentEntity>().Where(
                        TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionItemResponses.Id)), token);
                    result.Results.ForEach(entity => entities.Add(entity.Comment));
                    token = result.ContinuationToken;
                } while (token != null);

                interventionItemResponses.Comments = entities;
            }
            return new JsonResult(interventionItemResponses);
        }

        public class IdReqest
        {
            public string Id { get; set; }
        }
    }
}
