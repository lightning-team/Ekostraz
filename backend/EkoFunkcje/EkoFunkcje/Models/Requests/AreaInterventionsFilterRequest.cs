using System;
using System.Collections.Generic;
using System.Text;

namespace EkoFunkcje.Models.Requests
{
    public class AreaInterventionsFilterRequest
    {
        public List<int> Statuses { get; set; }

        public double GeoLatDiff { get; set; }

        public double GeoLngDiff { get; set; }

        public AreaInterventionsFilterRequest()
        {
            Statuses = new List<int>
            {
                0, 1, 2
            };
        }
    }
}
