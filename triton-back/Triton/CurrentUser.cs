using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Triton.Application.Common.Interfaces;

namespace Triton
{
    public class CurrentUser : ICurrentUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetId()
        {
            return _httpContextAccessor?.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        public string GetEmail()
        {
            return _httpContextAccessor?.HttpContext?.User?.FindFirst(ClaimTypes.Email)?.Value;
        }

        public ClaimsPrincipal GetClaimsPrincipal()
        {
            return _httpContextAccessor?.HttpContext?.User;
        }
    }
}
