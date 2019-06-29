using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;


namespace EkoFunkcje
{

    //todo add validation
    public class PrivateInterventionDto
    {
        [Required(ErrorMessage = "No full name")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "No description")]
        public string Description { get; set; }

        public int PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Adress { get; set; }

        public string Status { get; set; }
    }
}
