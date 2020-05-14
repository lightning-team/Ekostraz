using EkoFunkcje.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using EkoFunkcje.Models.Respones;
using EkoFunkcje.Utils;
using EkoFunkcje.Utils.Exceptions;

namespace EkoFunkcje
{
    public class AddressConverter : IAddressConverter 
    {
        private readonly HttpClient _httpClient;
        private readonly IAddressValidator _addressValidator;
        private readonly string _apiMapsAccessKey;
        private const string ApiAddress = "https://maps.googleapis.com/maps/api/geocode/json?address=";

        public AddressConverter(HttpClient httpClient, IAddressValidator addressValidator)
        {
            _httpClient = httpClient;
            _addressValidator = addressValidator;
            _apiMapsAccessKey = Environment.GetEnvironmentVariable("MapKey", EnvironmentVariableTarget.Process);
        }

        public async Task<Address> ConvertToGeoAddress(string city, string street, string streetNumber)
        {
            var response = await _httpClient.GetAsync($"{ApiAddress}{city},{street},{streetNumber}&key={_apiMapsAccessKey}");
            if (!response.IsSuccessStatusCode)
                throw new Exception("Request unsuccesful");
            var responsBody = await response.Content.ReadAsStringAsync();
            GoogleGeoCodeResponse addressDeserializeObject = JsonConvert.DeserializeObject<GoogleGeoCodeResponse>(responsBody);

            var responseLocation = addressDeserializeObject.results.FirstOrDefault();
            if (responseLocation == null)
            {
                throw new MatchingAddressNotFoundException($"{city},{street},{streetNumber}");
            }

            _addressValidator.ValidateGoogleApiResponse(city, street, streetNumber, responseLocation);

            dynamic loc = responseLocation.geometry.location;

            var addressObj = new Address();
            addressObj.Latitude = loc.lat;
            addressObj.Lognitude = loc.lng;
            return addressObj;
        }

        
    }

    public interface IAddressConverter
    {
        Task<Address> ConvertToGeoAddress(string city, string street, string streetNumber);
    }
}
