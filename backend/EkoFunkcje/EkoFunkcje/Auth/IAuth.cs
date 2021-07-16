using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Auth
{
    public interface IAuth
    {
        bool IsAuthorized(HttpRequest request, string functionName);
        Role GetUserRole(HttpRequest request);
    }

    public class Auth : IAuth
    {
        private readonly IDictionary<string, Role> _roles;
        private IDictionary<string, Role> _userRoles;
        private readonly System.Timers.Timer _timer;
        private CloudTable _cloudTable;
        private readonly string _connectionString;
        private readonly ILogger<Auth> _logger;

        private Auth(IDictionary<string, Role> roles, string storageConnectionString, ILogger<Auth> logger)
        {
            _logger = logger;
            _roles = roles ?? new Dictionary<string, Role>();
            _connectionString = storageConnectionString;
            _timer = new System.Timers.Timer(3600000)
            {
                AutoReset = true
            };
            _timer.Elapsed += TimerElapsed;
            _timer.Start();
        }

        public static async Task<Auth> InitializeAuthAsync(IDictionary<string, Role> roles, string storageConnectionString,
            ILogger<Auth> logger)
        {
            var auth = new Auth(roles, storageConnectionString, logger);
            await auth.InitializeDatabaseConnection();
            auth._userRoles = await auth.LoadUserRoles();
            return auth;
        }

        private async Task InitializeDatabaseConnection()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(_connectionString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            _cloudTable = tableClient.GetTableReference(Config.UserRolesTableName);
            await _cloudTable.CreateIfNotExistsAsync();
        }

        private void TimerElapsed(object sender, ElapsedEventArgs e)
        {
            var userRoles = LoadUserRoles().GetAwaiter().GetResult();
            Interlocked.Exchange(ref _userRoles, userRoles);
        }

        private async Task<IDictionary<string, Role>> LoadUserRoles()
        {
            TableContinuationToken token = null;
            var entities = new List<UserRole>();
            do
            {
                var queryResult = await _cloudTable.ExecuteQuerySegmentedAsync(new TableQuery<UserRole>(), token);
                entities.AddRange(queryResult.Results);
                token = queryResult.ContinuationToken;
            } while (token != null);
            return entities.ToImmutableDictionary(e => e.UserId, e => e.Role);
        }

        public bool IsAuthorized(HttpRequest request, string functionName)
        {
            if (!request.IsAuthenticated())
                return false;
            if (!_roles.ContainsKey(functionName))
                return true;
            var roleNeeded = _roles[functionName];
            var userName = request.HttpContext.User.Identity.Name;
            if (!_userRoles.ContainsKey(userName))
                return false;
            var userRole = _userRoles[userName];
            return userRole >= roleNeeded;
        }

        public Role GetUserRole(HttpRequest request)
        {
            if (!request.IsAuthenticated())
                return Role.User;
            var userName = request.HttpContext.User.Identity.Name;
            if (!_userRoles.ContainsKey(userName))
                return Role.Empty;
            return _userRoles[userName];
        }
    }

    public enum Role
    {   
        Empty = 0,
        User = 1,
        Moderator = 4,
        Admin = 6
    }
}
