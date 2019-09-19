using EkoFunkcje.Models;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;

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

            dynamic loc = addressDeserializeObject.results.First.geometry.location;
            var addressObj = new Address();
            addressObj.Latitude = loc.lat;
            addressObj.Lognitude = loc.lng;
            return addressObj;
        }
    }

    public interface IAddressConverter
    {
        Task<Address> ConvertToGeoAddress(string address);
    }
}
