using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Blob;

namespace EkoFunkcje.Features.Attachments
{
    public static class DeleteAttachmentFunction
    {
        [FunctionName("DeleteAttachment")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "DeleteAttachment" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "interventions/{interventionId}/attachments/{fileId}")] HttpRequestMessage req,
            [Blob("attachments/{interventionId}/{fileId}", FileAccess.Write, Connection = Config.StorageConnectionName)] CloudBlockBlob blobToDelete,
            ILogger log)
        {
            try
            {
                await blobToDelete.DeleteIfExistsAsync();
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent("Attachment successfully deleted", Encoding.UTF8, "text/plain"),
                };
            }
            catch (Exception e)
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("Could not find the blob", Encoding.UTF8, "text/plain"),
                };
            }
        }
    }
}
