using System.ComponentModel.DataAnnotations;

namespace EkoFunkcje.Models.Dto
{
    public class InterventionDto
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

        [Required(ErrorMessage = "No city")]
        public string City { get; set; }

        [Required(ErrorMessage = "No street")]
        public string Street { get; set; }

        [Required(ErrorMessage = "No address")]
        public string StreetNumber { get; set; }

        public string Address => $"{City},{Street},{StreetNumber}";

        public int Status { get; set; }
    }
}
