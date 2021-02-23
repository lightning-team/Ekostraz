using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using EkoFunkcje.Models.Respones;
using EkoFunkcje.Utils;
using EkoFunkcje.Utils.Exceptions;

namespace EkoFunkcje
{
    public class ReCaptchaService : IReCaptchaService 
    {
        private readonly HttpClient _httpClient;
        private readonly string _captchaSecretKey;
        private const string ApiAddress = "https://www.google.com/recaptcha/api/siteverify";

        public ReCaptchaService(HttpClient httpClient, IAddressValidator addressValidator)
        {
            _httpClient = httpClient;
            _captchaSecretKey = Environment.GetEnvironmentVariable("CaptchaSecretKey", EnvironmentVariableTarget.Process);
        }

        public async Task ValidateCaptcha(string captchaResult) {
            var postParams = new Dictionary<string, string>();
            postParams.Add("secret", _captchaSecretKey);
            postParams.Add("response", captchaResult);

            var response = await _httpClient.PostAsync(ApiAddress, new FormUrlEncodedContent(postParams));
            if (!response.IsSuccessStatusCode)
                throw new Exception("ReCaptcha request failed");

            var responseBody = await response.Content.ReadAsStringAsync();
            GoogleCaptchaResponse captchaValidationObj = JsonConvert.DeserializeObject<GoogleCaptchaResponse>(responseBody);

            if (!captchaValidationObj.success) {
                throw new GoogleCaptchaVerificationFailedException();
            }
        }
    }
    
    public interface IReCaptchaService
    {
        Task ValidateCaptcha(string captchaResult);
    }
}