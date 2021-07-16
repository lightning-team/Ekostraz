using EkoFunkcje.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.IO;
using System.Threading.Tasks;

namespace EkoFunkcje.Features.Attachments
{
    public class GetAttachmentFunction
    {
        private readonly IAuth _auth;
        public GetAttachmentFunction(IAuth auth)
        {
            _auth = auth;
        }

        [FunctionName("GetAttachment")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "GetAttachment" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public static async Task<HttpResponseMessage> Run(
[HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{interventionId}/attachments/{fileId}")]  HttpRequest req,
            [Blob("attachments/{interventionId}/{fileId}", FileAccess.Read, Connection = Config.StorageConnectionName)] CloudBlockBlob blob,
            ILogger log)
        {
            if (!_auth.IsAuthorized(req, "GetAttachment"))
                return new UnauthorizedResult();
            Stream attachmentStream;
            try
            {
                attachmentStream = await blob.OpenReadAsync(AccessCondition.GenerateEmptyCondition(),
                    new BlobRequestOptions(), new OperationContext());
            }
            catch
            {
                return new NotFoundResult();
            }

            await blob.FetchAttributesAsync();

            return CreateAttachmentResult(attachmentStream, blob.Properties);
        }

        public static IActionResult CreateAttachmentResult(Stream attachmentStream, BlobProperties blobProps)
        {
            var response = new FileStreamResult(attachmentStream, new MediaTypeHeaderValue(new StringSegment(blobProps.ContentType)));
            response.FileDownloadName = blobProps.ContentDisposition;
            return response;
        }
    }

}
