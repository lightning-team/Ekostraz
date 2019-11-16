using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Blob;

namespace EkoFunkcje.Features.Attachments
{
    public static class DeleteAttachmentFunction
    {
        [FunctionName("DeleteAttachment")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "interventions/{interventionId}/attachments/{fileId}")] HttpRequestMessage req,
            [Blob("attachments/{interventionId}/{fileId}", FileAccess.Write, Connection = Config.StorageConnectionName)] CloudBlockBlob blobToDelete,
            ILogger log)
        {
            try
            {
                await blobToDelete.DeleteIfExistsAsync();
                return req.CreateResponse(HttpStatusCode.OK, "Attachment successfully deleted");
            }
            catch (Exception e)
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Could not find the blob");
            }
        }
    }
}
