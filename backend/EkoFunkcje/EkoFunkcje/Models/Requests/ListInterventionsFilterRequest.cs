using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using EkoFunkcje.Utils.Query;

namespace EkoFunkcje.Models.Requests
{
    public class ListInterventionsFilterRequest
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }  
        public SortDirection SortDirection { get; set; }
        public List<InterventionStatus> Statuses { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        public ListInterventionsFilterRequest(IQueryCollection query)
        {
            Page = query.Get<int>("page", 1);
            PageSize = query.Get<int>("pageSize", 20);
            SortBy = query.Get<string>("sortBy", "CreationDate");
            SortDirection = query.Get<SortDirection>("sortDirection", SortDirection.Descending);
            Statuses = query.All<InterventionStatus>("statuses");
            // TODO: Add date params parsing below
            DateTo = null;
            DateFrom = null;
        }
    }
}
