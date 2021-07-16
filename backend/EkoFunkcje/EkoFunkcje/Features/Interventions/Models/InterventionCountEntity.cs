using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Interventions.Models
{
    public class InterventionCountEntity : TableEntity {
            public static string CountKey = "Count";

            public InterventionCountEntity() {
                this.PartitionKey = CountKey;
                this.RowKey = CountKey;
                this.Count = 1;
            }
               
            public int Count { get; set; }
    }
}