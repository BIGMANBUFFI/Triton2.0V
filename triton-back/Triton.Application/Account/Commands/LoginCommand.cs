using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Exceptions;
using Triton.Application.Common.Services;
using Triton.Domain.Users;

namespace Triton.Application.Account.Commands
{
    public class LoginCommand : IRequest<LoginResponse>
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;

        public LoginCommandHandler(
              UserManager<User> userManager,
              SignInManager<User> signInManager,
              TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                throw new TritonException();

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

            if (result.Succeeded)
            {
                return new LoginResponse
                {
                    Token = await _tokenService.CreateToken(user),
                    Id = user.Id,
                    Email = user.Email,
                    Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault()
                };
            }

            throw new TritonException();
        }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
        public string Id { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
