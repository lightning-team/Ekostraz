using System.Reflection;
using AzureFunctions.Extensions.Swashbuckle;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(EkoFunkcje.Startup))]

namespace EkoFunkcje
{
    public class Startup : IWebJobsStartup
    {
        public void Configure(IWebJobsBuilder builder)
        {
            builder.Services.AddHttpClient();
            builder.Services.AddSingleton<IAddressConverter, AddressConverter>();
            builder.AddSwashBuckle(Assembly.GetExecutingAssembly());
        }
    }
}