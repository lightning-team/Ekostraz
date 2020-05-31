using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace EkoFunkcje.Utils.Exceptions
{
    public class MatchingAddressNotFoundException : BaseException
    {
        public MatchingAddressNotFoundException(string address) : 
            base(new List<string>(){$"Nie znaleziono lokalizacji dla podanego adresu: {address}"}, LogLevel.Error)
        {
        }
    }
}
