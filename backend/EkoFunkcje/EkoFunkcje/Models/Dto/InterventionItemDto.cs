using System;

namespace EkoFunkcje
{
    public class InterventionItemDto
    {
        public string Id { get; set; }

        public DateTime CreationDate { get; set; }

        public string FullName { get; set; }

        public int PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Adress { get; set; }

        public string Status { get; set; }

        public double GeoLat { get; set; }

        public double GeoLng { get; set; }
    }
}
