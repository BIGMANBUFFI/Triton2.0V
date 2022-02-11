using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Triton.Application.Account.Commands;
using Triton.Application.Account.Queries;

namespace Triton.Controllers
{
    public class AccountController : BaseController
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<IActionResult> GetCurrentUser()
        {
            return Ok(await Mediator.Send(new GetCurrentUserQuery()));
        }
    }
}
