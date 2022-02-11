using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Triton.Application.Courses.Commands;
using Triton.Application.Courses.Queries;

namespace Triton.Controllers
{
    [Authorize]
    public class CourseController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            return Ok(await Mediator.Send(new GetCoursesQuery()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourse(string id)
        {
            return Ok(await Mediator.Send(new GetCourseQuery { Id = id }));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddCourse([FromBody] AddCourseCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpPost("{id}/topic")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> AddCourseTopic([FromBody] AddCourseTopicCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
