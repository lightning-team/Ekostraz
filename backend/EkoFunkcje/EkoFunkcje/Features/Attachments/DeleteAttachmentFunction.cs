using EkoFunkcje.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;

namespace EkoFunkcje.Features.Attachments
{
    public class DeleteAttachmentFunction
    {
        private readonly IAuth _auth;
        public DeleteAttachmentFunction(IAuth auth)
        {
            _auth = auth;
        }

        [FunctionName("DeleteAttachment")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "DeleteAttachment" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "interventions/{interventionId}/attachments/{fileId}")] HttpRequest req,
            [Blob("attachments/{interventionId}/{fileId}", FileAccess.Write, Connection = Config.StorageConnectionName)] CloudBlockBlob blobToDelete,
            ILogger log)
        {
            if (!_auth.IsAuthorized(req, "DeleteAttachment"))
                return new UnauthorizedResult();
            try
            {
                await blobToDelete.DeleteIfExistsAsync();
                return new OkObjectResult("Attachment successfully deleted");
            }
            catch (Exception)
            {
                return new BadRequestErrorMessageResult("Could not find the blob");
            }
        }
    }
}
