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
        public static string GetGeoHashFilter(string geoHash) {
            return TableQuery.GenerateFilterCondition(
                "PartitionKey", 
                QueryComparisons.Equal,
                geoHash
            );
        }

        public static string GetByIdFilter(string interventionId)
        {
            return TableQuery.GenerateFilterCondition(
                "RowKey",
                QueryComparisons.Equal,
                interventionId
            );
        }

        public static string GetInterventionGeoHashFilter(string geoHash, string interventionId)
        {
            return CombineFilters(
                GetGeoHashFilter(geoHash), 
                GetByIdFilter(interventionId)
            );
        }

        public static string GetInterventionListViewFilter(ListInterventionsFilterRequest filter)
        {
            List<string> filters = new List<string>();
            if (!string.IsNullOrWhiteSpace(filter.City))
            {
                string cityFilter = TableQuery.GenerateFilterCondition(
                    "City", QueryComparisons.Equal,
                    filter.City);
                filters.Add(cityFilter);
            }
            if (!string.IsNullOrWhiteSpace(filter.Street))
            {
                string streetFilter = TableQuery.GenerateFilterCondition(
                    "Street", QueryComparisons.Equal,
                    filter.Street);
                filters.Add(streetFilter);
            }
            if (filter.DateFrom != null)
            {
                string dateFromFilter = TableQuery.GenerateFilterConditionForDate(
                    "CreationDate", QueryComparisons.GreaterThanOrEqual,
                    new DateTimeOffset(filter.DateFrom.Value));
                filters.Add(dateFromFilter);
            }
            if (filter.DateTo != null)
            {
                string dateToFilter = TableQuery.GenerateFilterConditionForDate(
                    "CreationDate", QueryComparisons.LessThanOrEqual,
                    new DateTimeOffset(filter.DateTo.Value));
                filters.Add(dateToFilter);

            }
            if (filter.Status != -1)
            {
                string statusFilter = TableQuery.GenerateFilterConditionForInt(
                    "Status", QueryComparisons.Equal,
                    filter.Status);
                filters.Add(statusFilter);
            }

            return CombineFilters(filters);
        }

        public static string GetAreaFilter(string latitude, string longitude, double GeoLatDiff, double GeoLngDiff)
        {
            string latFilterFrom = TableQuery.GenerateFilterConditionForDouble(
                "GeoLat", QueryComparisons.GreaterThanOrEqual,
                Convert.ToDouble(latitude) - GeoLatDiff);
            string latFilterTo = TableQuery.GenerateFilterConditionForDouble(
                "GeoLat", QueryComparisons.LessThanOrEqual,
                Convert.ToDouble(latitude) + GeoLatDiff);
            string lngFilterFrom = TableQuery.GenerateFilterConditionForDouble(
                "GeoLng", QueryComparisons.GreaterThanOrEqual,
                Convert.ToDouble(longitude) - GeoLngDiff);
            string lngFilterTo = TableQuery.GenerateFilterConditionForDouble(
                "GeoLng", QueryComparisons.LessThanOrEqual,
                Convert.ToDouble(longitude) + GeoLngDiff);

            return CombineFilters(
                new List<string> {latFilterFrom, latFilterTo, lngFilterFrom, lngFilterTo}
            );
        }

        private static string CombineFilters(string filter, string combinedFilter)
        {
            if (string.IsNullOrWhiteSpace(combinedFilter)) {
                return filter;
            }
            if (string.IsNullOrWhiteSpace(filter)) {
                return combinedFilter;
            }
            return TableQuery.CombineFilters(
                filter,
                TableOperators.And,
                combinedFilter
            );
        }

        private static string CombineFilters(List<string> filters) {
            var finalFilter = "";
            foreach(string filter in filters) {
                finalFilter = CombineFilters(finalFilter, filter);
            }
            return finalFilter;
        }
    }
}
