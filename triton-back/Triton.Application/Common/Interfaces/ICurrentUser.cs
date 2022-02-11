using System.Security.Claims;

namespace Triton.Application.Common.Interfaces
{
    public interface ICurrentUser
    {
        public string GetId();
        public string GetEmail();
        public ClaimsPrincipal GetClaimsPrincipal();
    }
}
