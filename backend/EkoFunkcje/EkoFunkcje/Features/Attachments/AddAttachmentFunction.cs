using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
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
    public static class AddAttachmentFunction
    {
        [FunctionName("AddAttachment")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "AddAttachment" })]
        [OpenApiParameter(name: "interventionId", In = ParameterLocation.Path, Required = true, Type = typeof(string), Visibility = OpenApiVisibilityType.Important)]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions/{interventionId}/attachments")] HttpRequestMessage req,
            [Blob("attachments/{interventionId}/{rand-guid}", FileAccess.Write , Connection = Config.StorageConnectionName)] CloudBlockBlob newBlob,
            ILogger log)
        {
            HttpContentHeaders contentHeaders = req.Content.Headers;
            if (contentHeaders.ContentLength == 0) {
                return new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("No attachment sent", Encoding.UTF8, "application/json"),
                };
            }

            if (await newBlob.ExistsAsync())
            {
                return new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent("File under that path already exists", Encoding.UTF8, "application/json"),
                };
            }

            newBlob.Properties.ContentType = contentHeaders.ContentType.MediaType;
            //newBlob.Properties.ContentDisposition = contentHeaders.ContentDisposition.ToString();

            var imageStream = await req.Content.ReadAsStreamAsync();
            await newBlob.UploadFromStreamAsync(imageStream);

            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("Attachment successfully uploaded", Encoding.UTF8, "application/json"),
            };
        }
    }
}
