using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EkoFunkcje.Models;
using EkoFunkcje.Models.Dto;
using EkoFunkcje.Models.Respones;
using EkoFunkcje.Utils;
using EkoFunkcje.Utils.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.WindowsAzure.Storage.Table;
using NGeoHash;

namespace EkoFunkcje.Features.Interventions
{
    public class EditInterventionFunction
    {
        private readonly IMapper _mapper;
        private readonly IAddressConverter _addressConverter;
        
        public EditInterventionFunction(IAddressConverter addressConverter)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<InterventionEntity, InterventionItemResponse>()
                .ForMember(dest => dest.Id,
                    opts => opts.MapFrom(src => src.RowKey))
                .ForMember(dest => dest.Comments,
                    opts => opts.MapFrom(src => src.GetComments())));
            _mapper = config.CreateMapper();
            _addressConverter = addressConverter;
        }

        [FunctionName("EditInterventionGeoHash")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "EditInterventionGeoHash" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<IActionResult> RunWithGeoHash(
            [HttpTrigger(AuthorizationLevel.Function, "put", Route = "interventions/{latitude}/{longitude}/{interventionId}")]
            InterventionDto editedIntervention,
            [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
            string latitude, string longitude, string interventionId, ILogger log)
        {
            var geoHash = GeoHasher.GetGeoHash(latitude, longitude);
            var finalFilter = InterventionFilterBuilder.GetInterventionGeoHashFilter(geoHash, interventionId);

            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
                finalFilter).Take(1), null);

            var interventionToEdit = queryResult.Results.FirstOrDefault();

            if (interventionToEdit == null)
            {
                return new StatusCodeResult(StatusCodes.Status404NotFound);
            }
            
            if (AddressChanged(interventionToEdit, editedIntervention))
            {
                Address convertedGeoAddress = new Address();
                try
                {
                    convertedGeoAddress = await _addressConverter.ConvertToGeoAddress(editedIntervention.City, editedIntervention.Street, editedIntervention.StreetNumber);
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

                InterventionEntity adddedInterventionEntity = new InterventionEntity()
                {
                    Email = editedIntervention.Email,
                    CreationDate = interventionToEdit.CreationDate,
                    ModificationDate = DateTime.UtcNow,
                    Description = editedIntervention.Description,
                    FullName = editedIntervention.FullName,
                    PhoneNumber = editedIntervention.PhoneNumber,
                    Status = (int)editedIntervention.Status,
                    City = editedIntervention.City,
                    Street = editedIntervention.Street,
                    StreetNumber = editedIntervention.StreetNumber,
                    GeoLat = convertedGeoAddress.Latitude,
                    GeoLng = convertedGeoAddress.Lognitude,
                    PartitionKey = GeoHash.Encode(convertedGeoAddress.Latitude, convertedGeoAddress.Lognitude, Config.GeoHashPrecision),
                    CommentsJson = interventionToEdit.CommentsJson
                };

                TableOperation deleteOldIntervention = TableOperation.Delete(interventionToEdit);
                TableOperation insertNewIntervention = TableOperation.InsertOrReplace(adddedInterventionEntity);

                TableBatchOperation batch = new TableBatchOperation { deleteOldIntervention, insertNewIntervention };
                await interventionsTable.ExecuteBatchAsync(batch);

                var addedItemResponse = _mapper.Map<InterventionItemResponse>(adddedInterventionEntity);
                return new JsonResult(addedItemResponse);
            }

            interventionToEdit.Email = editedIntervention.Email;
            interventionToEdit.ModificationDate = DateTime.UtcNow;
            interventionToEdit.Description = editedIntervention.Description;
            interventionToEdit.FullName = editedIntervention.FullName;
            interventionToEdit.PhoneNumber = editedIntervention.PhoneNumber;
            interventionToEdit.Status = (int)editedIntervention.Status;

            await interventionsTable.ExecuteAsync(TableOperation.Merge(interventionToEdit));
            var interventionItemResponses = _mapper.Map<InterventionItemResponse>(interventionToEdit);

            return new JsonResult(interventionItemResponses);
        }

        [FunctionName("EditIntervention")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "EditIntervention" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        public async Task<IActionResult> Run(
          [HttpTrigger(AuthorizationLevel.Function, "put", Route = "interventions/{interventionId}")]
          InterventionDto editedIntervention,
          [Table(Config.InterventionsTableName, Connection = Config.StorageConnectionName)] CloudTable interventionsTable,
          string interventionId, ILogger log)
        {
            var queryResult = await interventionsTable.ExecuteQuerySegmentedAsync(new TableQuery<InterventionEntity>().Where(
              TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, interventionId)).Take(1), null);
            var interventionToEdit = queryResult.Results.FirstOrDefault();

            if (interventionToEdit == null)
            {
              return new StatusCodeResult(StatusCodes.Status404NotFound);
            }


            if (AddressChanged(interventionToEdit, editedIntervention))
            {
              Address convertedGeoAddress = new Address();
              try
              {
                convertedGeoAddress = await _addressConverter.ConvertToGeoAddress(editedIntervention.City, editedIntervention.Street, editedIntervention.StreetNumber);
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

                InterventionEntity adddedInterventionEntity = new InterventionEntity()
              {
                  RowKey = interventionToEdit.RowKey,
                  Email = editedIntervention.Email,
                  CreationDate = interventionToEdit.CreationDate,
                  ModificationDate = DateTime.UtcNow,
                  Description = editedIntervention.Description,
                  FullName = editedIntervention.FullName,
                  PhoneNumber = editedIntervention.PhoneNumber,
                  Status = (int)editedIntervention.Status,
                  City = editedIntervention.City,
                  Street = editedIntervention.Street,
                  StreetNumber = editedIntervention.StreetNumber,
                  GeoLat = convertedGeoAddress.Latitude,
                  GeoLng = convertedGeoAddress.Lognitude,
                  PartitionKey = GeoHash.Encode(convertedGeoAddress.Latitude, convertedGeoAddress.Lognitude, Config.GeoHashPrecision),
                  CommentsJson = interventionToEdit.CommentsJson
              };

              TableOperation deleteOldIntervention = TableOperation.Delete(interventionToEdit);
              TableOperation insertNewIntervention = TableOperation.InsertOrReplace(adddedInterventionEntity);
              await interventionsTable.ExecuteAsync(deleteOldIntervention);
              await interventionsTable.ExecuteAsync(insertNewIntervention);
              var addedItemResponse = _mapper.Map<InterventionItemResponse>(adddedInterventionEntity);
              return new JsonResult(addedItemResponse);
            }

            interventionToEdit.Email = editedIntervention.Email;
            interventionToEdit.ModificationDate = DateTime.UtcNow;
            interventionToEdit.Description = editedIntervention.Description;
            interventionToEdit.FullName = editedIntervention.FullName;
            interventionToEdit.PhoneNumber = editedIntervention.PhoneNumber;
            interventionToEdit.Status = (int)editedIntervention.Status;

            await interventionsTable.ExecuteAsync(TableOperation.Merge(interventionToEdit));
            var interventionItemResponses = _mapper.Map<InterventionItemResponse>(interventionToEdit);

            return new JsonResult(interventionItemResponses);
        }

        private bool AddressChanged(InterventionEntity interventionToEdit, InterventionDto editedIntervention)
        {
            return interventionToEdit.Address != editedIntervention.Address;
        }

    }
}
