using System;
using System.Collections.Generic;
using EkoFunkcje.Models.Dto;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace EkoFunkcje.Models
{
    public class InterventionEntity : TableEntity
    {
        public InterventionEntity()
        {
            this.RowKey = Guid.NewGuid().ToString();
        }

        public DateTime CreationDate { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }
         
        public int Status { get; set; }

        public string Address { get; set; }

        public double GeoLat { get; set; }

        public double GeoLng { get; set; }

        public string CommentsJson { get; set; }

        [IgnoreProperty]
        public ICollection<CommentDto> Comments {
            get
            {
                return JsonConvert.DeserializeObject<ICollection<CommentDto>>(CommentsJson);
            }
            set
            {
                CommentsJson = JsonConvert.SerializeObject(value);
            }
        }
    }
}
