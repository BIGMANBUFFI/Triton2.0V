using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Triton.Application.Students.Commands;
using Triton.Application.Students.Queries;

namespace Triton.Controllers
{
    [Authorize(Roles = "Admin,Teacher")]
    public class StudentController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetStudents(string teacherId, string courseId)
        {
            return Ok(await Mediator.Send(new GetStudentsQuery { TeacherId = teacherId, CourseId = courseId } ));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddStudent([FromBody] AddStudentCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveId(string id)
        {
            return Ok(await Mediator.Send(new RemoveStudentCommand { Id = id }));
        }
    }
}
