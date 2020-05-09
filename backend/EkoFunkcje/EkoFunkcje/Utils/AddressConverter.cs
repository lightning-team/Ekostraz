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
            string[] responseAddressComponents = responseLocation.address_components;

            if (addressSplit[0].ToLower() != responseAddressComponents[2].ToLower())
            {
                throw new GoogleResponseWrongCityException(addressSplit[0], responseAddressComponents[2]);
            }
            if (addressSplit[1].ToLower() != responseAddressComponents[1].ToLower())
            {
                throw new GoogleResponseWrongStreetException(addressSplit[1], responseAddressComponents[1]);
            }
            if (addressSplit[2].ToLower() != responseAddressComponents[0].ToLower())
            {
                throw new GoogleResponseWrongStreetNumberException(addressSplit[2], responseAddressComponents[0]);
            }
        }
    }

    public interface IAddressConverter
    {
        Task<Address> ConvertToGeoAddress(string address);
    }
}
