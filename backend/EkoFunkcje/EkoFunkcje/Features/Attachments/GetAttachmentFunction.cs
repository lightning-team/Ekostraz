﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models.Requests;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace EkoFunkcje.Features.Attachments
{
    public static class GetAttachmentFunction
    {
        [FunctionName("GetAttachment")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{interventionId}/attachments/{fileName}")]  HttpRequestMessage req,
            [Blob("attachments/{interventionId}/{fileName}", FileAccess.Write, Connection = Config.StorageConnectionName)] CloudBlockBlob blob,
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

            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(attachmentStream)
            };

            //If needed on frontend, here add ContentType in the header
            return result;
        }
    }
}
