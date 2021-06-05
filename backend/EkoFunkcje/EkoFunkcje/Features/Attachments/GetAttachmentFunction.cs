using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace EkoFunkcje.Features.Attachments
{
    public static class GetAttachmentFunction
    {
        [FunctionName("GetAttachment")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "GetAttachment" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{interventionId}/attachments/{fileId}")]  HttpRequestMessage req,
            [Blob("attachments/{interventionId}/{fileId}", FileAccess.Read, Connection = Config.StorageConnectionName)] CloudBlockBlob blob,
            ILogger log)
        {
            Stream attachmentStream;
            try
            {
                attachmentStream = await blob.OpenReadAsync(AccessCondition.GenerateEmptyCondition(),
                    new BlobRequestOptions(), new OperationContext());
            }
            catch
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }

            await blob.FetchAttributesAsync();

            return createAttachmentResult(attachmentStream, blob.Properties);
        }
        public static HttpResponseMessage createAttachmentResult(Stream attachmentStream, BlobProperties blobProps) {
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(attachmentStream)
            };

            ContentDisposition blobContentDisposition = new ContentDisposition(blobProps.ContentDisposition);
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue(blobContentDisposition.DispositionType)
            {
                FileName = blobContentDisposition.FileName
            };
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(blobProps.ContentType);
            
            return result;
        }
    }

}
