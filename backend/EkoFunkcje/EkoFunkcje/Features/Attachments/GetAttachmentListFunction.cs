using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace EkoFunkcje.Features.Attachments
{
    public static class GetAttachmentListFunction
    {
        [FunctionName("GetAttachmentList")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetAttachmentList/{interventionId}")] HttpRequestMessage req,
            [Blob("attachments/{interventionId}", FileAccess.Read, Connection = Config.StorageConnectionName)] CloudBlobContainer blobContainer,
            ILogger log)
        {
            try
            {
                var blobs = await blobContainer.ListBlobsSegmentedAsync(String.Empty, true, 
                    BlobListingDetails.All, Int32.MaxValue, null, new BlobRequestOptions(), new OperationContext());
                var paths = blobs.Results.Select(e => e.Uri.AbsoluteUri);
                return req.CreateResponse(HttpStatusCode.OK, paths);
            }
            catch (Exception)
            {
                return req.CreateErrorResponse(HttpStatusCode.BadRequest, "Could not find the container");
            }
        }
    }
}
