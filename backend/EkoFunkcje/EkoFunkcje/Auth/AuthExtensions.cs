using Microsoft.AspNetCore.Http;

namespace EkoFunkcje.Auth
{
    public static class AuthExtensions
    {
        public static bool IsAuthenticated(this HttpRequest request)
        {
#if DEBUG
            return true;
#endif
            return request.HttpContext.User.Identity.IsAuthenticated && request.HttpContext.User.Identity.AuthenticationType != "WebJobsAuthLevel";
        }
    }
}
