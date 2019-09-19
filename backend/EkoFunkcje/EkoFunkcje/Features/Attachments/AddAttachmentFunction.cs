using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace EkoFunkcje.Features.Attachments
{
    public static class AddAttachmentFunction
    {
        [FunctionName("AddAttachment")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "AddIntervention/{interventionId}")] HttpRequestMessage req,
            [Blob("attachments/{interventionId}", FileAccess.Write , Connection = Config.StorageConnectionName)] Stream myBlob,
            string interventionId, ILogger log)
        {
            // TODO
            log.LogInformation("C# HTTP trigger function processed a request.");

            var readAsString = await req.Content.ReadAsStringAsync();

            using (Stream stream = new MemoryStream(Encoding.UTF8.GetBytes(readAsString)))
            {
                await stream.CopyToAsync(myBlob);
            }


            return new OkObjectResult($"Hello,");
        }
    }
}
