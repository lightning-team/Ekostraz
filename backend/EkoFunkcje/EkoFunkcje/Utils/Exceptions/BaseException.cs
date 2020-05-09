using System;
using Microsoft.Extensions.Logging;


namespace EkoFunkcje.Utils.Exceptions
{
    public abstract class BaseException : Exception
    {
        public LogLevel LogLevel { get; set; }

        protected BaseException()
        {

        }

        protected BaseException(string message, LogLevel logLevel) : base(message)
        {
            LogLevel = logLevel;
        }

        protected BaseException(string message, Exception innerException, LogLevel logLevel) : base(message, innerException)
        {
            LogLevel = logLevel;
        }
    }
}
