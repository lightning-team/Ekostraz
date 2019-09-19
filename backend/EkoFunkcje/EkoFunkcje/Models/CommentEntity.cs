using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Models
{
    public  class CommentEntity : TableEntity
    {
        public CommentEntity(string interventionId)
        {
            this.PartitionKey = System.Guid.NewGuid().ToString();
            this.RowKey = interventionId;
        }

        public CommentEntity()
        {
        }

        public string Comment { get; set; }

    }
}
