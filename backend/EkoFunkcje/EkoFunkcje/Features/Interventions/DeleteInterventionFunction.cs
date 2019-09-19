using System.Linq;
using System.Threading.Tasks;
using EkoFunkcje.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Features.Interventions
{
    public static class DeleteRequestFunction
    {
        [FunctionName("DeleteRequestFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "DeleteIntervention")] DeletionRequest request, 
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)]CloudTable interventions,
            ILogger log)
        {
            var results = await interventions.ExecuteQuerySegmentedAsync(
                new TableQuery<InterventionEntity>().Where(
                    TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, request.Id)), new TableContinuationToken());
            var requestedIntervention = results.Results.FirstOrDefault();
            if (requestedIntervention == null)
                return new StatusCodeResult(StatusCodes.Status404NotFound);
            await interventions.ExecuteAsync(TableOperation.Delete(requestedIntervention));
            return new StatusCodeResult(StatusCodes.Status200OK);
        }

        public class DeletionRequest
        {
            public string Id { get; set; }
        }
    }

}
