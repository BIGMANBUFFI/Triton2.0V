using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Interfaces;
using Triton.Application.Common.Services;
using Triton.Domain.Users;

namespace Triton.Application.Account.Queries
{
    public class GetCurrentUserQuery : IRequest<GetCurrentUserResult>
    {

    }

    public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, GetCurrentUserResult>
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly ICurrentUser _currentUser;

        public GetCurrentUserQueryHandler(
             UserManager<User> userManager,
              TokenService tokenService,
              ICurrentUser currentUser)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _currentUser = currentUser;

        }
        public async Task<GetCurrentUserResult> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == _currentUser.GetEmail());

            return new GetCurrentUserResult
            {
                Token = await _tokenService.CreateToken(user),
                Id = user.Id,
                Email = user.Email,
                Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault()
            };
        }
    }

    public class GetCurrentUserResult
    {
        public string Token { get; set; }
        public string Id { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
