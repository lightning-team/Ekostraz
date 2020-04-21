using System.ComponentModel.DataAnnotations;

namespace EkoFunkcje.Models.Dto
{
    public class InterventionDto
    {
        public string FullName { get; set; }

        [Required(ErrorMessage = "Opis jest wymagany")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Numer telefonu jest wymagany")]
        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; }

        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Miasto jest wymagane")]
        public string City { get; set; }

        [Required(ErrorMessage = "Ulica jest wymagana")]
        public string Street { get; set; }

        [Required(ErrorMessage = "Numer domu/mieszkania jest wymagany")]
        public string StreetNumber { get; set; }

        public string Address => $"{City},{Street},{StreetNumber}";

        public InterventionStatus Status { get; set; }
    }
}
