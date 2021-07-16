using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using EkoFunkcje.Models.Requests;
using EkoFunkcje.Interventions.Models;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Utils
{
    public static class InterventionFilterBuilder
    {
        private static class InterventionFieldNames
        {
            public static string PartitionKey = "PartitionKey";
            public static string RowKey = "RowKey";
            public static string City = "City";
            public static string Street = "Street";
            public static string CreationDate = "CreationDate";
            public static string Status = "Status";
            public static string GeoLat = "GeoLat";
            public static string GeoLng = "GeoLng";
        }
        
        public static string GetGeoHashFilter(string geoHash) {
            return TableQuery.GenerateFilterCondition(
                InterventionFieldNames.PartitionKey, 
                QueryComparisons.Equal,
                geoHash
            );
        }

        public static string GetByIdFilter(string interventionId)
        {
            return TableQuery.GenerateFilterCondition(
                InterventionFieldNames.RowKey,
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
            string excludeCountEntityFilter = TableQuery.GenerateFilterCondition(
                InterventionFieldNames.PartitionKey, 
                QueryComparisons.NotEqual,
                InterventionCountEntity.CountKey
            );
            
            List<string> filters = new List<string>() {
                excludeCountEntityFilter
            };
            if (!string.IsNullOrWhiteSpace(filter.City))
            {
                string cityFilter = TableQuery.GenerateFilterCondition(
                    InterventionFieldNames.City, 
                    QueryComparisons.Equal,
                    filter.City);
                filters.Add(cityFilter);
            }
            if (!string.IsNullOrWhiteSpace(filter.Street))
            {
                string streetFilter = TableQuery.GenerateFilterCondition(
                    InterventionFieldNames.Street, 
                    QueryComparisons.Equal,
                    filter.Street);
                filters.Add(streetFilter);
            } 
            if (filter.Statuses.Any())
            {
                List<string> statusFilters = new List<string>();

                foreach (int status in filter.Statuses) {
                    statusFilters.Add(
                        TableQuery.GenerateFilterConditionForInt(
                            InterventionFieldNames.Status, 
                            QueryComparisons.Equal,
                            status
                        )
                    );
                }
                string statusesFilter = CombineFilters(statusFilters, TableOperators.Or); 
                filters.Add(statusesFilter);
            }
            if (filter.DateFrom != null)
            {
                string dateFromFilter = TableQuery.GenerateFilterConditionForDate(
                    InterventionFieldNames.CreationDate, 
                    QueryComparisons.GreaterThanOrEqual,
                    new DateTimeOffset(filter.DateFrom.Value));
                filters.Add(dateFromFilter);
            }
            if (filter.DateTo != null)
            {
                string dateToFilter = TableQuery.GenerateFilterConditionForDate(
                    InterventionFieldNames.CreationDate,
                    QueryComparisons.LessThanOrEqual,
                    new DateTimeOffset(filter.DateTo.Value));
                filters.Add(dateToFilter);

            }

            return CombineFilters(filters);
        }

        public static string GetAreaFilter(string latitude, string longitude, double GeoLatDiff, double GeoLngDiff)
        {
            string latFilterFrom = TableQuery.GenerateFilterConditionForDouble(
                InterventionFieldNames.GeoLat, 
                QueryComparisons.GreaterThanOrEqual,
                ConvertToDouble(latitude) - GeoLatDiff
            );
            string latFilterTo = TableQuery.GenerateFilterConditionForDouble(
                InterventionFieldNames.GeoLat, 
                QueryComparisons.LessThanOrEqual,
                ConvertToDouble(latitude) + GeoLatDiff
            );
            string lngFilterFrom = TableQuery.GenerateFilterConditionForDouble(
                InterventionFieldNames.GeoLng, 
                QueryComparisons.GreaterThanOrEqual,
                ConvertToDouble(longitude) - GeoLngDiff
            );
            string lngFilterTo = TableQuery.GenerateFilterConditionForDouble(
                InterventionFieldNames.GeoLng, 
                QueryComparisons.LessThanOrEqual,
                ConvertToDouble(longitude) + GeoLngDiff
            );

            return CombineFilters(
                new List<string> {latFilterFrom, latFilterTo, lngFilterFrom, lngFilterTo}
            );
        }

        private static double ConvertToDouble(string value)
        {
            if (value.Contains(","))
            {
                return Convert.ToDouble(value, CultureInfo.CurrentCulture);
            }
            return Convert.ToDouble(value, CultureInfo.InvariantCulture);
        }

        private static string CombineFilters(string filter, string combinedFilter, string tableOperator = TableOperators.And)
        {
            if (string.IsNullOrWhiteSpace(combinedFilter)) {
                return filter;
            }
            if (string.IsNullOrWhiteSpace(filter)) {
                return combinedFilter;
            }
            return TableQuery.CombineFilters(
                filter,
                tableOperator,
                combinedFilter
            );
        }

        private static string CombineFilters(List<string> filters, string tableOperator = TableOperators.And) {
            var finalFilter = "";
            foreach(string filter in filters) {
                finalFilter = CombineFilters(finalFilter, filter, tableOperator);
            }
            return finalFilter;
        }
    }
}
