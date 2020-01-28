using System;
using System.Collections.Generic;
using EkoFunkcje.Models.Dto;

namespace EkoFunkcje.Models.Respones
{
    public class InterventionItemResponse
    {
        public string Id { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime ModificationDate { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string City { get; set; }

        public string Street { get; set; }

        public string StreetNumber { get; set; }

        public string Status { get; set; }

        public double GeoLat { get; set; }

        public double GeoLng { get; set; }

        public ICollection<CommentDto> Comments { get; set; }
    }
}
