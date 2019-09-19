using System;
using System.Collections.Generic;
using System.Text;

namespace EkoFunkcje.Models.Requests
{
    public class EditCommentRequest
    {
        public string Id { get; set; }
        public string NewValue { get; set; }
    }
}
