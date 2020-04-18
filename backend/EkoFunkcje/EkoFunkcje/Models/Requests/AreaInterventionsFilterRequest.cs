using System;
using System.Collections.Generic;
using System.Text;

namespace EkoFunkcje.Models.Requests
{
    public class AreaInterventionsFilterRequest
    {
        public List<InterventionStatus> Statuses { get; set; }

        public double GeoLatDiff { get; set; }

        public double GeoLngDiff { get; set; }
    }
}
