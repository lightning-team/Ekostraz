using Newtonsoft.Json;

namespace EkoFunkcje.Models.Respones
{
    public class GoogleCaptchaResponse
    {

        public bool success { get; set; }

        [JsonProperty(PropertyName="error-codes")]
        public string[] errorCodes { get; set; }
    }
}