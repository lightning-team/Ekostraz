using System;
using System.Collections.Generic;
using System.Text;

namespace EkoFunkcje.Models.Dto
{
    public class AttachmentDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public long Size { get; set; }
        public string Type { get; set; }
    }
}
