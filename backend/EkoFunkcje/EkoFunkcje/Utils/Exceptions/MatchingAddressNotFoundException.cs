using Microsoft.Extensions.Logging;

namespace EkoFunkcje.Utils.Exceptions
{
    public class MatchingAddressNotFoundException : BaseException
    {
        public MatchingAddressNotFoundException(string address) : base($"Nie znaleziono lokalizacji dla podanego adresu: {address}", LogLevel.Error)
        {
        }
    }
}
