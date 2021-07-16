using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace EkoFunkcje.Utils.Exceptions
{
    public class GoogleCaptchaVerificationFailedException : BaseException
    {
        private static string[] errorArr = {"Nie udało się zweryfikować zapezpieczenia antyspamowego. Spróbuj jeszcze raz."};
        public GoogleCaptchaVerificationFailedException() : 
            base(new List<string>(errorArr), LogLevel.Error)
        {
        }
    }
}
