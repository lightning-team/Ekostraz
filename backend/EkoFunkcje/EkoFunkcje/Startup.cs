using System.Reflection;
using AzureFunctions.Extensions.Swashbuckle;
using EkoFunkcje.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters.Json.Internal;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

[assembly: FunctionsStartup(typeof(EkoFunkcje.Startup))]

namespace EkoFunkcje
{
    public class Startup : IWebJobsStartup
    {
        public void Configure(IWebJobsBuilder builder)
        {
            builder.Services.AddTransient<IConfigureOptions<MvcOptions>, MvcJsonMvcOptionsSetup>(); //https://github.com/Azure/azure-webjobs-sdk-extensions/issues/486
            builder.Services.AddHttpClient();
            builder.Services.AddSingleton<IAddressConverter, AddressConverter>();
            builder.Services.AddSingleton<IAddressValidator, AddressValidator>();
            builder.Services.AddSingleton<IStringTranslator, PolishCharactersTranslator>();
            builder.AddSwashBuckle(Assembly.GetExecutingAssembly());
        }
    }
}