using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mime;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using EkoFunkcje.Models.Dto;
using Microsoft.Azure.WebJobs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;


namespace EkoFunkcje.Features.Attachments
{
    public static class GetAttachmentListFunction
    {
        [FunctionName("GetAttachmentList")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "interventions/{interventionId}/attachments")] HttpRequestMessage req,
            [Blob("attachments/{interventionId}", FileAccess.Read, Connection = Config.StorageConnectionName)] CloudBlobDirectory blobDirectory,
            string interventionId,
            ILogger log)
        {
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
