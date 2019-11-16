using System;
using System.Collections.Generic;
using System.Text;

namespace EkoFunkcje.Models.Dto
{
    public class CommentDto
    {
        public string Id { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
