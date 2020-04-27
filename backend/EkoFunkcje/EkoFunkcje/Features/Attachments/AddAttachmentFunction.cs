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
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions/{interventionId}/attachments")] HttpRequestMessage req,
            IBinder binder, string interventionId, ILogger log)
        {
            if (req.Content.Headers.ContentLength != 0)
            {
                var fileName = req.Content.Headers.ContentDisposition?.FileName;
                if (fileName == null)
                {
                    return req.CreateErrorResponse(HttpStatusCode.BadRequest, "No FileName ContentDisposition");
                }
                var attribute = new BlobAttribute($"attachments/{interventionId}/{fileName}", FileAccess.Read);
                attribute.Connection = Config.StorageConnectionName;

                var newBlob = await binder.BindAsync<CloudBlockBlob>(attribute);
                if (!await newBlob.ExistsAsync())
                {
                    var imageStream = await req.Content.ReadAsStreamAsync();
                    await newBlob.UploadFromStreamAsync(imageStream);
                    return await Task.FromResult(req.CreateResponse(HttpStatusCode.OK, "Attachment successfully uploaded"));
                }
                return req.CreateErrorResponse(HttpStatusCode.Conflict, "File under that path already exists");

            }
            return req.CreateErrorResponse(HttpStatusCode.BadRequest, "No attachment sent");
        }
    }
}
