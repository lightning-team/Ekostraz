using System;
using System.Collections.Generic;
using EkoFunkcje.Models.Dto;

namespace EkoFunkcje.Models.Respones
{
    public class InterventionItemResponse : InterventionListItemResponse
    {
        public ICollection<CommentDto> Comments { get; set; }
    }
}
