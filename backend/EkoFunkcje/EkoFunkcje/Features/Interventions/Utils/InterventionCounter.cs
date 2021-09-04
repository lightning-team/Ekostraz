using EkoFunkcje.Interventions.Models;
using Microsoft.WindowsAzure.Storage.Table;
using System.Threading.Tasks;

namespace EkoFunkcje.Interventions.Utils {
    public static class InterventionCounter {
        public static async Task<int> GetNextId(CloudTable interventionsTable)
        {
            InterventionCountEntity counter = await GetCountEntity(interventionsTable);
            (int nextCount, TableOperation operation) = GetNextCount(counter);

            await interventionsTable.ExecuteAsync(operation);
            
            return nextCount;
        }

        private static async Task<InterventionCountEntity> GetCountEntity(CloudTable interventionsTable)
        {
            TableOperation getCountEntity = TableOperation.Retrieve<InterventionCountEntity>(
                InterventionCountEntity.CountKey, InterventionCountEntity.CountKey
            );
            TableResult result = await interventionsTable.ExecuteAsync(getCountEntity);
            return (InterventionCountEntity)result.Result;
        }

        private static (int, TableOperation) GetNextCount(InterventionCountEntity counter)
        {
            if (counter == null) {
                var newCounter = new InterventionCountEntity();
                return (newCounter.Count, TableOperation.Insert(newCounter));
            }
            else {
                return (++counter.Count, TableOperation.Replace(counter));
            }
        }
    }
}