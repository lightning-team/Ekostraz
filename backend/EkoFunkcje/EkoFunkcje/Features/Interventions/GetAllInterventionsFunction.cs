using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Requests;
using EkoFunkcje.Models.Respones;
using EkoFunkcje.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
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

        [FunctionName("GetAllInterventions")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions")]
            [RequestBodyType(typeof(ListInterventionsFilterRequest), "ListInterventionsFilterRequest")] HttpRequest request,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            ILogger log)
        {   
            ListInterventionsFilterRequest requestParams = new ListInterventionsFilterRequest(request.Query);
            string filter = InterventionFilterBuilder.GetInterventionListViewFilter(requestParams);
            List<InterventionListItemResponse> interventions = await GetInterventions(interventionsTable, filter);
            IQueryable<InterventionListItemResponse> pagedInterventions = SortAndPaginateInterventions(interventions, requestParams);
            return new JsonResult(new
            {
                totalCount = interventions.Count(),
                results = pagedInterventions
            });
        }

        private async Task<List<InterventionListItemResponse>> GetInterventions(CloudTable interventionsTable, string finalFilter)
        {
            TableContinuationToken token = null;
            var interventions = new List<InterventionListItemResponse>();
            do
            {
                var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                    finalFilter), token);
                interventions.AddRange(queryResult.Results.Select(x => _mapper.Map<InterventionListItemResponse>(x)));
                token = queryResult.ContinuationToken;
            } while (token != null);
            return interventions;
        }

        private static IQueryable<InterventionListItemResponse> SortAndPaginateInterventions(
            List<InterventionListItemResponse> interventions, ListInterventionsFilterRequest requestParams
        )
        {
            var sortedEntities = requestParams.SortDirection == SortDirection.Descending ?
                interventions.AsQueryable().OrderByDescending(requestParams.SortBy ?? "CreationDate")
                : interventions.AsQueryable().OrderBy(requestParams.SortBy ?? "CreationDate");

            var pagedEntities = sortedEntities.Skip((requestParams.Page - 1) * requestParams.PageSize).Take(requestParams.PageSize);
            
            return pagedEntities;
        }
    }
}
