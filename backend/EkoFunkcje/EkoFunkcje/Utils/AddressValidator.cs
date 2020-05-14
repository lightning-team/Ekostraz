using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EkoFunkcje.Models.Respones;
using EkoFunkcje.Utils.Exceptions;

namespace EkoFunkcje.Utils
{
    public class AddressValidator : IAddressValidator
    {

        private const string City = "locality";
        private const string Street = "route";
        private const string StreetNumber = "street_number";

        private readonly IStringTranslator _polishTranslator;

        public AddressValidator(IStringTranslator polishTranslator)
        {
            _polishTranslator = polishTranslator;
        }

        public void ValidateGoogleApiResponse(string city, string street, string streetNumber, results responseLocation)
        {
            List<string> validationErrors = new List<string>();
            var responseCity = GetAddressComponentByType(responseLocation, City);
            var responseStreet = GetAddressComponentByType(responseLocation, Street);
            var responseStreetNumber = GetAddressComponentByType(responseLocation, StreetNumber);

            ValidateCity(validationErrors, city, responseCity);
            ValidateStreet(validationErrors, street, responseStreet);
            ValidateStreetNumber(validationErrors, streetNumber, responseStreetNumber);

            if (validationErrors.Any())
            {
                throw new GoogleResponseWrongAddressException(validationErrors);
            }
        }

        private void ValidateStreetNumber(List<string> validationErrors, string streetNumber, string responseStreetNumber)
        {
            if (string.IsNullOrWhiteSpace(responseStreetNumber))
            {
                validationErrors.Add($"Nie znaleziono takiego numeru ulicy: {streetNumber}");
            }
        }

        private void ValidateStreet(List<string> validationErrors, string street, string responseStreet)
        {
            if (string.IsNullOrWhiteSpace(responseStreet))
            {
                validationErrors.Add($"Nie znaleziono ulicy: {street}");
            }

            if (_polishTranslator.TranslatePolishCharsInString(street).ToLower() != _polishTranslator.TranslatePolishCharsInString(responseStreet).ToLower())
            {
                validationErrors.Add($"Znalezione miasto: {responseStreet} nie odpowiada podanemu: {street}");
            }
        }

        private void ValidateCity(List<string> validationErrors, string city, string responseCity)
        {
            if (string.IsNullOrWhiteSpace(responseCity))
            {
                validationErrors.Add($"Nie znaleziono miasta: {city}");
            }

            if (_polishTranslator.TranslatePolishCharsInString(city).ToLower() != _polishTranslator.TranslatePolishCharsInString(responseCity).ToLower())
            {
                validationErrors.Add($"Znalezione miasto: {responseCity} nie odpowiada podanemu: {city}");
            }
        }

        private string GetAddressComponentByType(results responseLocation, string type)
        {
            var result = responseLocation.address_components.FirstOrDefault(x => x.types.Contains(type));
            return result?.long_name;
        }
    }

    public interface IAddressValidator
    {
        void ValidateGoogleApiResponse(string city, string street, string streetNumber, results responseLocation);
    }
}
