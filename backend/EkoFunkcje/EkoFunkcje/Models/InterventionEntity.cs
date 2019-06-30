using Microsoft.WindowsAzure.Storage.Table;
using System;

namespace EkoFunkcje
{
    class InterventionEntity : TableEntity
    {
        public InterventionEntity(string rowKey)
        {
            this.PartitionKey = Guid.NewGuid().ToString();
            this.RowKey = rowKey.ToString();
        }

        public InterventionEntity() { }

        public DateTime CreationDate { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Status { get; set; }

        public string Address { get; set; }

        public double GeoLat { get; set; }

        public double GeoLng { get; set; }
    }
}
