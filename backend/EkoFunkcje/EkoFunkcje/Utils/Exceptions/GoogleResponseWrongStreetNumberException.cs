using Microsoft.Extensions.Logging;

namespace EkoFunkcje.Utils.Exceptions
{
    public class GoogleResponseWrongStreetNumberException : BaseException
    {
        public GoogleResponseWrongStreetNumberException(string sentStreetNumber, string responseStreetNumber) : base($"Podany numer lokalu ({sentStreetNumber}) nie zgadza się ze zwróconym numerem lokalu: {responseStreetNumber}", LogLevel.Error)
        {
        }
    }
}
