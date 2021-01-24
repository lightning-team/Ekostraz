﻿using System;
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
            [RequestBodyType(typeof(ListInterventionsFilterRequest), "ListInterventionsFilterRequest")] ListInterventionsFilterRequest filter,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable cloudTable,
            ILogger log)
        {
            string finalFilter = InterventionFilterBuilder.GetInterventionListViewFilter(filter);

            TableContinuationToken token = null;
            var entities = new List<InterventionListItemResponse>();
            do
            {
                var queryResult = await cloudTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                    finalFilter), token);
                entities.AddRange(queryResult.Results.Select(x => _mapper.Map<InterventionListItemResponse>(x)));
                token = queryResult.ContinuationToken;
            } while (token != null);

            if (filter.Statuses.Length > 0)
            {
                // NOTE: Crazy workaround for the lack of List params support in Swashbuckle RequestBodyType.
                // We expect this to be a string with comma-delimited values, e.g "1,2" which represent Status values.
                // Maybe we should consider using QueryStringParamaterAttribute: https://github.com/yuka1984/azure-functions-extensions-swashbuckle
                // Or just ditch the Swashbuckle here and use simple req.Query() params from native cloud functions
                try {
                    List<int> statusFilters = filter.Statuses.Split(',').ToList().ConvertAll(int.Parse);
                    entities = entities.Where(intervention => statusFilters.Contains((int)intervention.Status)).ToList();
                } catch(Exception e) {}
                
            }
            var sortedEntities = filter.SortDirection == (int)SortDirection.Descending ?
                entities.AsQueryable().OrderByDescending(filter.SortBy ?? "CreationDate")
                : entities.AsQueryable().OrderBy(filter.SortBy ?? "CreationDate");

            var pagedEntities = sortedEntities.Skip((filter.Page - 1) * filter.PageSize).Take(filter.PageSize);
            var result = new
            {
                totalCount = sortedEntities.Count(),
                results = pagedEntities
            };
            return new JsonResult(result);
        }
    }
}
