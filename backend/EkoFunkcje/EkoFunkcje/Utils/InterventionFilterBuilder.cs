using System;
using System.Collections.Generic;
using System.Text;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Requests;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Utils
{
    public static class InterventionFilterBuilder
    {
        public static string GetInterventionGeoHashFilter(string geoHash, string interventionId)
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

        public static string GetInterventionListViewFilter(ListInterventionsFilterRequest filter)
        {
            string finalFilter = "";
            if (!string.IsNullOrWhiteSpace(filter.City))
            {
                string cityFilter = TableQuery.GenerateFilterCondition(
                    "City", QueryComparisons.Equal,
                    filter.City);
                finalFilter = TableQuery.CombineFilters(
                    cityFilter,
                    TableOperators.And,
                    finalFilter);
            }
            if (!string.IsNullOrWhiteSpace(filter.Street))
            {
                string streetFilter = TableQuery.GenerateFilterCondition(
                    "Street", QueryComparisons.Equal,
                    filter.Street);
                finalFilter = TableQuery.CombineFilters(
                    streetFilter,
                    TableOperators.And,
                    finalFilter);
            }
            if (filter.DateFrom != null)
            {
                string dateFromFilter = TableQuery.GenerateFilterConditionForDate(
                    "DateFrom", QueryComparisons.GreaterThanOrEqual,
                    new DateTimeOffset(filter.DateFrom.Value));
                finalFilter = TableQuery.CombineFilters(
                    dateFromFilter,
                    TableOperators.And,
                    finalFilter);
            }
            if (filter.DateTo != null)
            {
                string dateToFilter = TableQuery.GenerateFilterConditionForDate(
                    "DateTo", QueryComparisons.LessThanOrEqual,
                    new DateTimeOffset(filter.DateTo.Value));
                finalFilter = TableQuery.CombineFilters(
                    dateToFilter,
                    TableOperators.And,
                    finalFilter);
            }
            if (filter.Status != -1)
            {
                string statusFilter = TableQuery.GenerateFilterConditionForInt(
                    "Status", QueryComparisons.Equal,
                    filter.Status);
                finalFilter = TableQuery.CombineFilters(
                    statusFilter,
                    TableOperators.And,
                    finalFilter);
            }

            return finalFilter;
        }

        public static string GetByIdFilter(string interventionId) {
            return TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionId);
        }
    }
}
