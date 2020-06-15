using System;
using System.Collections.Generic;
using System.Text;

namespace EkoFunkcje.Models.Requests
{
    public class ListInterventionsFilterRequest
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SortBy { get; set; }
        public int? SortDirection { get; set; }
        public List<InterventionStatus> Statuses { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        public ListInterventionsFilterRequest()
        {
            Page = 1;
            PageSize = 20;
            SortBy = "CreationDate";
            SortDirection = (int)Models.SortDirection.Descending;
            Statuses = new List<InterventionStatus>();
            DateTo = null;
            DateFrom = null;
        }
    }
}
