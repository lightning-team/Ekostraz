using EkoFunkcje.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace EkoFunkcje.Features.Authorization
{
    public class GetUserRoleFunction
    {
        private readonly IAuth _auth;
        public GetUserRoleFunction(IAuth auth)
        {
            _auth = auth;
        }

        [FunctionName("GetUserRole")]
        public IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "auth/me")] HttpRequest request)
        {
            return new JsonResult(_auth.GetUserRole(request));
        }
    }
}
