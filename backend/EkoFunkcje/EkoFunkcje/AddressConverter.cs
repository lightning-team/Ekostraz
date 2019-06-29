using EkoFunkcje.Models;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;


namespace EkoFunkcje
{
    class AddressConverter
    {
        public async Task<Address> ConvertToGeoAddress(string address)
        {
            HttpClient client = new HttpClient();

            var accessMapKey = Environment.GetEnvironmentVariable("MapKey", EnvironmentVariableTarget.Process);

            var response = await client.GetStringAsync("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + accessMapKey);

            dynamic addressDeserializeObject = JsonConvert.DeserializeObject(response);

            dynamic loc = addressDeserializeObject.results.First.geometry.location;

            var addressObj = new Address();
            addressObj.lat = loc.lat;
            addressObj.lng = loc.lng;

            return addressObj;

        }
    }
}
