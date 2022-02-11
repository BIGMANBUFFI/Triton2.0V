using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Triton.Application.Teachers.Commands;
using Triton.Application.Teachers.Queries;

namespace Triton.Controllers
{
    [Authorize(Roles = "Admin,Teacher")]
    public class TeacherController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetTeachers()
        {
            return Ok(await Mediator.Send(new GetTeachersQuery()));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddTeacher([FromBody] AddTeacherCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
