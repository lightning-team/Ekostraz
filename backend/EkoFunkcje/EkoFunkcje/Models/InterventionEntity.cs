using System;
using System.Collections.Generic;
using System.Linq;
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
            this._commentsCollection = new List<CommentDto>();
        }

        public DateTime CreationDate { get; set; }

        public DateTime ModificationDate { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }
         
        public int Status { get; set; }

        public string City { get; set; }

        public string Street { get; set; }

        public string StreetNumber { get; set; }

        public string Address => $"{City},{Street},{StreetNumber}";

        public double GeoLat { get; set; }

        public double GeoLng { get; set; }
        private string _commentsJson; 

        public string CommentsJson
        {
            get => _commentsJson;
            set
            {
                _commentsJson = value;
                _commentsCollection = JsonConvert.DeserializeObject<ICollection<CommentDto>>(value);
            }
        }

        private ICollection<CommentDto> _commentsCollection;

        public void AddComment(CommentDto commentDto)
        {
            _commentsCollection.Add(commentDto);
            _commentsJson = JsonConvert.SerializeObject(_commentsCollection);
        }

        public void EditComment(string commentId, string newValue)
        {
            var commentToEdit = _commentsCollection.First(x => x.Id == commentId);
            commentToEdit.Comment = newValue;
            _commentsJson = JsonConvert.SerializeObject(_commentsCollection);
        }

        public void DeleteComment(string commentId)
        {
            var commentToDelete = _commentsCollection.First(x => x.Id == commentId);
            _commentsCollection.Remove(commentToDelete);
            _commentsJson = JsonConvert.SerializeObject(_commentsCollection);
        }

        public ICollection<CommentDto> GetComments()
        {
            return _commentsCollection;
        }
    }
}
