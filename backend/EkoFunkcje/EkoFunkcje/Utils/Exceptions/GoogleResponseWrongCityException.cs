using Microsoft.Extensions.Logging;

namespace EkoFunkcje.Utils.Exceptions
{
    public class GoogleResponseWrongCityException : BaseException
    {
        public GoogleResponseWrongCityException(string sentCity, string responseCity) : base($"Podane miasto ({sentCity}) nie zgadza się ze zwróconym miastem: {responseCity}", LogLevel.Error)
        {
        }
    }
}
