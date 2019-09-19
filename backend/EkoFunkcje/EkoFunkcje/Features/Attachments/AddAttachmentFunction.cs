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
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequestMessage req,
            [Blob("files/{name}", FileAccess.Write , Connection = "DefaultEndpointsProtocol=https;AccountName=ekoststorage;AccountKey=PU2SpmrVyjwBuofntWwdTB7gjgZgOK2fUwwffK3Mt5nebprjIRzZfXMZyDPfN1yWMk6wXP0UM1HFkrl9zUUIyQ==;EndpointSuffix=core.windows.net")]Stream myBlob,
            string name, ILogger log)
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
