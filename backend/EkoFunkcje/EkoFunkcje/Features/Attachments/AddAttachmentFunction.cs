using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Blob;

namespace EkoFunkcje.Features.Attachments
{
    public static class AddAttachmentFunction
    {
        [FunctionName("AddAttachment")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "AddAttachment/{interventionId}/{fileName}")] HttpRequestMessage req,
            [Blob("http://127.0.0.1:10000/devstoreaccount1/attachments/12345/av-2102622222.jpg", FileAccess.Write , Connection = Config.StorageConnectionName)] CloudBlockBlob newBlob,
            ILogger log)
        {
            if (req.Content.Headers.ContentLength != 0)
            {
                if (!await newBlob.ExistsAsync())
                {
                    var imageStream = await req.Content.ReadAsStreamAsync();
                    await newBlob.UploadFromStreamAsync(imageStream);
                    return await Task.FromResult(req.CreateResponse(HttpStatusCode.OK, "Attachment successfully uploaded"));
                }
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "File under that path already exists");

            }
            return req.CreateErrorResponse(HttpStatusCode.BadRequest, "No attachment sent");
        }
    }
}
