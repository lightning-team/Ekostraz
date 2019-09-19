using Microsoft.WindowsAzure.Storage.Table;
using System;

namespace EkoFunkcje
{
    public class InterventionEntity : TableEntity
    {
        public InterventionEntity()
        {
            this.PartitionKey = DateTime.UtcNow.Date.ToShortDateString();
            this.RowKey = Guid.NewGuid().ToString();
        }

        public DateTime CreationDate { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }
         
        public int Status { get; set; }

        public string Address { get; set; }

        public double GeoLat { get; set; }

        public double GeoLng { get; set; }
    }
}
