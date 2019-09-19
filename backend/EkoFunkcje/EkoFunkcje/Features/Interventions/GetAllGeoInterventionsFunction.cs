using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Respones;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Features.Interventions
{
    public static class GetAllGeoInterventionsFunction
    {
        [FunctionName("GetAllGeoInterventions")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetAllGeoInterventions")] HttpRequestMessage req, 
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable cloudTable,
            ILogger log)
        {
            TableQuery<InterventionEntity> rangeQuery = new TableQuery<InterventionEntity>().Select(new List<string>() {"RowKey", "GeoLat", "GeoLng" }).Take(100);
            
            TableContinuationToken token = null;
            var entities = new List<GeoListItemResponse>();
            do
            {
                var queryResult = await cloudTable.ExecuteQuerySegmentedAsync(rangeQuery, token);
                entities.AddRange(queryResult.Results.Select(x => new GeoListItemResponse() {InterventionId = x.RowKey, GeoLat = x.GeoLat, GeoLng = x.GeoLng}));
                token = queryResult.ContinuationToken;
            } while (token != null);

            return new JsonResult(entities);
        }
    }
}
