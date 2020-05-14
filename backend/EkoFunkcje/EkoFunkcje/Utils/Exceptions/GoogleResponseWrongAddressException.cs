using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace EkoFunkcje.Utils.Exceptions
{
    public class GoogleResponseWrongAddressException : BaseException
    {
        public GoogleResponseWrongAddressException(IEnumerable<string> validationErrors) : base(string.Join(';', validationErrors), LogLevel.Error)
        {
        }
    }
}
