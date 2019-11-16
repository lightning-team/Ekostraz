using System;
using System.Collections.Generic;
using System.Text;
using EkoFunkcje.Models;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Utils
{
    public static class InterventionFilterBuilder
    {
        public static string GetInterventionFilter(string geoHash, string interventionId)
        {
            string geoHashFilter = TableQuery.GenerateFilterCondition(
                "PartitionKey", QueryComparisons.Equal,
                geoHash);
            string idFilter = TableQuery.GenerateFilterCondition(
                "RowKey", QueryComparisons.Equal,
                interventionId);

            string finalFilter = TableQuery.CombineFilters(
                geoHashFilter,
                TableOperators.And,
                idFilter);
            return finalFilter;
        }
    }
}
