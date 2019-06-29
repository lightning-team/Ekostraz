using System;
using System.Collections.Generic;
using System.Text;

namespace EkoFunkcje
{
    public class InterventionListItemDto
    {
        public DateTime CreationDate { get; set; }

        public string FullName { get; set; }

        public int PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Adress { get; set; }

        public string Status { get; set; }
    }
}
