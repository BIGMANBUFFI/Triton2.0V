using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Triton.Application.Enrollments.Commands;
using Triton.Application.Enrollments.Queries;

namespace Triton.Controllers
{
    [Authorize]
    public class EnrollmentController : BaseController
    {
        [HttpGet]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetEnrollments(bool? expired)
        {
            return Ok(await Mediator.Send(new GetEnrollmentsQuery { Expired = expired }));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddEnrollment([FromBody] AddEnrollmentCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
