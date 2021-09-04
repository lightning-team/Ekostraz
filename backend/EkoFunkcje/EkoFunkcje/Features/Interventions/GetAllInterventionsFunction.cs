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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EkoFunkcje.Features.Interventions
{
    public class GetAllInterventionsFunction
    {
        private readonly IMapper _mapper;
        private readonly IAuth _auth;

        public GetAllInterventionsFunction(IAuth auth)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionListItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.RowKey)));
            _mapper = config.CreateMapper();
            _auth = auth;
        }

        [FunctionName("GetAllInterventions")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "GetAllInterventions" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions")]
            /*[RequestBodyType(typeof(ListInterventionsFilterRequest), "ListInterventionsFilterRequest")]*/ HttpRequest req,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable cloudTable,
            ILogger log)
        {
            if (!_auth.IsAuthorized(req, "GetAllInterventions"))
                return new UnauthorizedResult();
            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var filter = JsonConvert.DeserializeObject<ListInterventionsFilterRequest>(content);
            string finalFilter = InterventionFilterBuilder.GetInterventionListViewFilter(filter);

            ListInterventionsFilterRequest requestParams = new ListInterventionsFilterRequest(req.Query);
            List<InterventionListItemResponse> interventions = await  GetInterventions(cloudTable, finalFilter);
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
