using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using EkoFunkcje.Auth;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
using EkoFunkcje.Utils.Exceptions;
using EkoFunkcje.Interventions.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using NGeoHash;

namespace EkoFunkcje.Features.Interventions
{
    public class AddInterventionFunction
    {
        private readonly IAddressConverter _addressConverter;
        private readonly IAuth _auth;
        private readonly IReCaptchaService _captchaService;
        public AddInterventionFunction(IAddressConverter addressConverter, IReCaptchaService captchaService, IAuth auth)
        {
            _addressConverter = addressConverter;
            _auth = auth;
            _captchaService = captchaService;
        }

        [FunctionName("AddIntervention")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "AddIntervention" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions")]
            [RequestBodyType(typeof(InterventionDto), "InterventionDto")]HttpRequest req, 
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] IAsyncCollector<InterventionEntity> interventions,
            ILogger log)
        {
            // Validate Captcha
            if (intervention.Captcha != null) {
                try
                {
                    await _captchaService.ValidateCaptcha(intervention.Captcha);
                }
                catch (BaseException e)
                {
                    log.Log(e.LogLevel, e, e.Message);
                    return new BadRequestObjectResult(e.Message);
                }
            }

            if (!_auth.IsAuthorized(req, "AddIntervention"))
                return new UnauthorizedResult();
            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var intervention = JsonConvert.DeserializeObject<InterventionDto>(content);
            // Validate InterventionDTO            var results = new List<ValidationResult>();
            if (!Validator.TryValidateObject(intervention, new ValidationContext(intervention, null, null), results))
            {
                var errorList = new List<string>();
                foreach (var error in results)
                {
                    errorList.Add(error.ErrorMessage);
                }
                string json = JsonConvert.SerializeObject(errorList);
                return new BadRequestObjectResult(json);
            }

            // Convert GoogleMaps Address
            Address convertedGeoAddress;
            try
            {
                convertedGeoAddress = await _addressConverter.ConvertToGeoAddress(intervention.City, intervention.Street, intervention.StreetNumber);
            }
            catch (BaseException e)
            {
                log.Log(e.LogLevel, e, e.Message);
                return new BadRequestObjectResult(e.Message);
            }
            catch (Exception e)
            {
                log.LogError(e, "Error podczas konwertowania adresu");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

            string interventionId = await AddIntervention(intervention, interventionsTable, convertedGeoAddress);
            return new JsonResult(new { id = interventionId });
        }

        private static async Task<string> AddIntervention(
            InterventionDto intervention, 
            CloudTable interventionsTable, 
            Address convertedGeoAddress
        )
        {
            int nextId = await InterventionCounter.GetNextId(interventionsTable);
            InterventionEntity interventionEntity = new InterventionEntity()
            {
                PartitionKey = GeoHash.Encode(convertedGeoAddress.Latitude, convertedGeoAddress.Lognitude, Config.GeoHashPrecision),
                RowKey = nextId.ToString(),
                Email = intervention.Email,
                City = intervention.City,
                Street = intervention.Street,
                StreetNumber = intervention.StreetNumber,
                CreationDate = DateTime.UtcNow,
                ModificationDate = DateTime.UtcNow,
                Description = intervention.Description,
                FullName = intervention.FullName,
                PhoneNumber = intervention.PhoneNumber,
                Status = (int) intervention.Status,
                GeoLat = convertedGeoAddress.Latitude,
                GeoLng = convertedGeoAddress.Lognitude,
            };
            
            TableOperation insertNewIntervention = TableOperation.Insert(interventionEntity);
            await interventionsTable.ExecuteAsync(insertNewIntervention);

            return interventionEntity.RowKey;
        }
    }
}
