using EkoFunkcje.Models;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using EkoFunkcje.Utils.Exceptions;

namespace EkoFunkcje
{
    public class AddressConverter : IAddressConverter 
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiMapsAccessKey;
        private const string ApiAddress = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        public AddressConverter(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _apiMapsAccessKey = Environment.GetEnvironmentVariable("MapKey", EnvironmentVariableTarget.Process);
        }

        public async Task<Address> ConvertToGeoAddress(string address)
        {
            var response = await _httpClient.GetAsync($"{ApiAddress}{address}&key={_apiMapsAccessKey}");
            if (!response.IsSuccessStatusCode)
                throw new Exception("Request unsuccesful");
            var responsBody = await response.Content.ReadAsStringAsync();
            dynamic addressDeserializeObject = JsonConvert.DeserializeObject(responsBody);


            ValidateGoogleApiResponse(address, addressDeserializeObject.results.First);

            dynamic loc = addressDeserializeObject.results.First.geometry.location;

            var addressObj = new Address();
            addressObj.Latitude = loc.lat;
            addressObj.Lognitude = loc.lng;
            return addressObj;
        }

        private void ValidateGoogleApiResponse(string address, dynamic responseLocation)
        {
            var addressSplit = address.Split(",");
            var responseCity = responseLocation.formatted_address.Value.Split(",")[1].Trim();
            var responseStreet = responseLocation.address_components[1].long_name.Value;
            var responseStreetNumber = responseLocation.address_components[0].long_name.Value;

            if (addressSplit[0].ToLower() != responseCity.ToLower())
            {
                throw new GoogleResponseWrongCityException(addressSplit[0], responseCity);
            }
            if (addressSplit[1].ToLower() != responseStreet.ToLower())
            {
                throw new GoogleResponseWrongStreetException(addressSplit[1], responseStreet);
            }
            if (addressSplit[2].ToLower() != responseStreetNumber.ToLower())
            {
                throw new GoogleResponseWrongStreetNumberException(addressSplit[2], responseStreetNumber);
            }
        }
    }

    public interface IAddressConverter
    {
        Task<Address> ConvertToGeoAddress(string address);
    }
}
