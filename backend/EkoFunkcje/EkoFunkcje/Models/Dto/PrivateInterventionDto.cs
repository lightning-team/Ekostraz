using System.ComponentModel.DataAnnotations;

namespace EkoFunkcje.Models.Dto
{
    public class PrivateInterventionDto
    {
        [Required(ErrorMessage = "No full name")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "No description")]
        public string Description { get; set; }

        [Required(ErrorMessage = "No phone number")]
        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; }

        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required(ErrorMessage = "No address")]
        public string Address { get; set; }

        public string Status { get; set; }
    }
}
