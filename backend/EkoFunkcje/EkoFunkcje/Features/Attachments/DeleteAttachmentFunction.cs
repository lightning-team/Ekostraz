using EkoFunkcje.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Web.Http;

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
        public async Task<IActionResult> Run(
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
