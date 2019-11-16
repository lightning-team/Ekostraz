using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Models
{
    public  class CommentEntity : TableEntity
    {
        public CommentEntity()
        {
            this.PartitionKey = DateTime.UtcNow.Date.ToShortDateString();
            this.RowKey = Guid.NewGuid().ToString();
        }

        public string InterventionId { get; set; }

        public string Comment { get; set; }

    }
}
