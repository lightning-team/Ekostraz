﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using EkoFunkcje.Models;
using Microsoft.AspNetCore.Http;

namespace EkoFunkcje
{
    public class AddPublicFormFunction
    {
        private readonly IAddressConverter _addressConverter;
        public AddPublicFormFunction(IAddressConverter addressConverter)
        {
            _addressConverter = addressConverter;
        }

        [FunctionName("AddPublicForm")]
        public async Task<ActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            PrivateInterventionDto intervention, 
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)]IAsyncCollector<InterventionEntity> interventions,
            ILogger log)
        {
            var results = new List<ValidationResult>();
            if (Validator.TryValidateObject(intervention, new ValidationContext(intervention, null, null), results))
            {
                var errorList = new List<string>();
                foreach (var error in results)
                {
                    errorList.Add(error.ErrorMessage);
                }
                string json = JsonConvert.SerializeObject(errorList);
                return new BadRequestObjectResult(json);
            }
            Address convertedGeoAddress = new Address();
            try
            {
                // retry should be added
                convertedGeoAddress = await _addressConverter.ConvertToGeoAddress(intervention.Address);
            }
            catch (Exception e)
            {
                log.LogError(e, "error");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            InterventionEntity interventionEntity = new InterventionEntity()
            {
                Email = intervention.Email,
                Address = intervention.Address,
                CreationDate = DateTime.UtcNow,
                Description = intervention.Description,
                FullName = intervention.FullName,
                PhoneNumber = intervention.PhoneNumber,
                Status = (int) InterventionStatus.ActionRequired,
                GeoLat = convertedGeoAddress.Latitude,
                GeoLng = convertedGeoAddress.Lognitude
            };
            await interventions.AddAsync(interventionEntity);
            await interventions.FlushAsync();
            return new JsonResult(new { Message = "Data Added"});
        }
    }
}