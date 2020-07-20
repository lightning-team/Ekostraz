using System.Collections.Generic;
using System.Reflection;
using AzureFunctions.Extensions.Swashbuckle;
using EkoFunkcje.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters.Json.Internal;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
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
            var config = new ConfigurationBuilder().AddEnvironmentVariables().Build();
            var connectionString = config.GetConnectionString(Config.StorageConnectionName);
            builder.Services.AddSingleton<IAuth, Auth.Auth>(e => Auth.Auth.InitializeAuthAsync(new Dictionary<string, Role>(), connectionString, e.GetService<ILogger<Auth.Auth>>()).GetAwaiter().GetResult());
            builder.AddSwashBuckle(Assembly.GetExecutingAssembly());
        }
    }
}