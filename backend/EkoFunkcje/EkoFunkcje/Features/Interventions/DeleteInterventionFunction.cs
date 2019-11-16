using System.Linq;
using System.Threading.Tasks;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
using EkoFunkcje.Models.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Features.Interventions
{
    public static class DeleteInterventionFunction
    {
        //TODO: Zastanowimy się czy potrzebujemy usuwania, czy nie dodamy status deleted
        //[FunctionName("DeleteIntervention")]
        //public static async Task<IActionResult> Run(
        //    [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "interventions/{interventionId}")]
        //    [RequestBodyType(typeof(DeletionRequest), "DeletionRequest")]DeletionRequest request, 
        //    [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)]CloudTable interventions,
        //    ILogger log)
        //{
        //    var results = await interventions.ExecuteQuerySegmentedAsync(
        //        new TableQuery<InterventionEntity>().Where(
        //            TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, request.Id)), new TableContinuationToken());
        //    var requestedIntervention = results.Results.FirstOrDefault();
        //    if (requestedIntervention == null)
        //        return new StatusCodeResult(StatusCodes.Status404NotFound);
        //    await interventions.ExecuteAsync(TableOperation.Delete(requestedIntervention));
        //    return new StatusCodeResult(StatusCodes.Status200OK);
        //}
    }

}
