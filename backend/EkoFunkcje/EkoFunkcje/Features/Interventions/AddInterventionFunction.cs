using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
using EkoFunkcje.Utils.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NGeoHash;

namespace EkoFunkcje.Features.Interventions
{
    public class AddInterventionFunction
    {
        private readonly IAddressConverter _addressConverter;
        public AddInterventionFunction(IAddressConverter addressConverter)
        {
            _addressConverter = addressConverter;
        }

        [FunctionName("AddIntervention")]
        public async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "interventions")]
            [RequestBodyType(typeof(InterventionDto), "InterventionDto")]InterventionDto intervention, 
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] IAsyncCollector<InterventionEntity> interventions,
            ILogger log)
        {
            var results = new List<ValidationResult>();
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

            Address convertedGeoAddress;
            try
            {
                // retry should be added
                convertedGeoAddress = await _addressConverter.ConvertToGeoAddress(intervention.Address);
            }
            catch (BaseException e)
            {
                log.Log(e.LogLevel, e, e.Message);
                return new BadRequestObjectResult(e.Message);
            }
            catch (Exception e)
            {
                log.LogError(e, "Podany adres jest niepoprawny");
                return new BadRequestObjectResult("Podany adres jest niepoprawny");
            }

            InterventionEntity interventionEntity = new InterventionEntity()
            {
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
                PartitionKey = GeoHash.Encode(convertedGeoAddress.Latitude, convertedGeoAddress.Lognitude, Config.GeoHashPrecision)
            };
            await interventions.AddAsync(interventionEntity);
            await interventions.FlushAsync();
            return new JsonResult(new { id = interventionEntity.RowKey});
        }
    }
}
