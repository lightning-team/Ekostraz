using EkoFunkcje.Auth;
using EkoFunkcje.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using EkoFunkcje.Models.Dto;
using Microsoft.Azure.WebJobs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;


namespace EkoFunkcje.Features.Attachments
{
    public class GetAttachmentListFunction
    {
        private readonly IAuth _auth;
        public GetAttachmentListFunction(IAuth auth)
        {
            _auth = auth;
        }

        [FunctionName("GetAttachmentList")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "GetAttachmentList" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public static async Task<IActionResult> Run(
[HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{interventionId}/attachments")] HttpRequest req,
            [Blob("attachments/{interventionId}", FileAccess.Read, Connection = Config.StorageConnectionName)] CloudBlobDirectory blobDirectory,
            string interventionId,
            ILogger log)
        {
            if (!_auth.IsAuthorized(req, "GetAttachmentList"))
                return new UnauthorizedResult();
            IEnumerable<CloudBlockBlob> fileResults = await GetAttachmentBlobs(blobDirectory);
            await FetchBlobsAttributes(fileResults);
            return new JsonResult(ToAttachmentDtoList(fileResults));
        }

        private static List<AttachmentDto> ToAttachmentDtoList(IEnumerable<CloudBlockBlob> fileResults)
        {
            return fileResults.Select(blob => new AttachmentDto()
            {
                Id = blob.Uri.Segments.Last(),
                Name = new ContentDisposition(blob.Properties.ContentDisposition).FileName,
                Type = blob.Properties.ContentType,
                Size = blob.Properties.Length
            }).ToList();
        }

        private static async Task<IEnumerable<CloudBlockBlob>> GetAttachmentBlobs(CloudBlobDirectory blobDirectory)
        {
            var blobs = await blobDirectory.ListBlobsSegmentedAsync(null);
            return blobs.Results
                    .Select(blob => blobDirectory.GetBlockBlobReference(blob.Uri.Segments.Last()))
                    .ToList();
        }

        private static async Task FetchBlobsAttributes(IEnumerable<CloudBlockBlob> fileResults)
        {
            List<Task> fetchBlobAttributesTasks = new List<Task>();
            foreach (var blob in fileResults)
            {
                fetchBlobAttributesTasks.Add(blob.FetchAttributesAsync());
            }
            await Task.WhenAll(fetchBlobAttributesTasks);
        }
    }
}
