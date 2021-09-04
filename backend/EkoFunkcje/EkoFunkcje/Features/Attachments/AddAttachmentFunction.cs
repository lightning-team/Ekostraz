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
using System.IO;
using System.Threading.Tasks;
using System.Web.Http;

namespace EkoFunkcje.Features.Attachments
{
    public class AddAttachmentFunction
    {
        private readonly IAuth _auth;
        public AddAttachmentFunction(IAuth auth)
        {
            _auth = auth;
        }

        [FunctionName("AddAttachment")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "AddAttachment" })]
        [OpenApiParameter(name: "interventionId", In = ParameterLocation.Path, Required = true, Type = typeof(string), Visibility = OpenApiVisibilityType.Important)]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions/{interventionId}/attachments")] HttpRequest req,
            [Blob("attachments/{interventionId}/{rand-guid}", FileAccess.Write , Connection = Config.StorageConnectionName)] CloudBlockBlob newBlob,
            ILogger log)
        {
            if (!_auth.IsAuthorized(req, "AddAttachment"))
                return new UnauthorizedResult();
            if (req.ContentLength == 0) {
                return new BadRequestErrorMessageResult("No attachment sent");
            }

            if (await newBlob.ExistsAsync())
            {
                return new ConflictObjectResult("File under that path already exists");
            }

            newBlob.Properties.ContentType = req.ContentType;
            newBlob.Properties.ContentDisposition = req.Headers.ContainsKey("Content-Disposition")? req.Headers["Content-Disposition"].ToString() : "";

            var imageStream = req.Body;
            await newBlob.UploadFromStreamAsync(imageStream);

            return new OkObjectResult("Attachment successfully uploaded");
        }
    }
}
