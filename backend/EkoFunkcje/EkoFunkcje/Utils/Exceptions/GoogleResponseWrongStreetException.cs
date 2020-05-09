using Microsoft.Extensions.Logging;

namespace EkoFunkcje.Utils.Exceptions
{
    public class GoogleResponseWrongStreetException : BaseException
    {
        public GoogleResponseWrongStreetException(string sentStreet, string responseStreet) : base($"Podana ulica ({sentStreet}) nie zgadza się ze zwróconą ulicą: {responseStreet}", LogLevel.Error)
        {
        }
    }
}
