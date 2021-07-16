using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;



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
        
        protected BaseException(IEnumerable<string> errors, LogLevel logLevel) : base(JsonConvert.SerializeObject(errors))
        {
            LogLevel = logLevel;
        }
    }
}
