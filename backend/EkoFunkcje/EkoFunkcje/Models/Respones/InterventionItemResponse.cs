﻿using System;
using System.Collections.Generic;

namespace EkoFunkcje
{
    public class InterventionItemResponse
    {
        public string Id { get; set; }

        public DateTime CreationDate { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Address { get; set; }

        public string Status { get; set; }

        public double GeoLat { get; set; }

        public double GeoLng { get; set; }

        public List<string> Comments { get; set; }
    }
}