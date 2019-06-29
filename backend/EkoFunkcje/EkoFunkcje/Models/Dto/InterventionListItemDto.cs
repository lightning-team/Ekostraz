using System;

namespace EkoFunkcje
{
    public class InterventionListItemDto
    {
        public string Id { get; set; }

        public DateTime CreationDate { get; set; }

        public string FullName { get; set; }

        public int PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Adress { get; set; }

        public string Status { get; set; }
    }
}
