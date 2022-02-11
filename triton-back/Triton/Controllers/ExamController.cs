using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Triton.Application.Exams.Commands;
using Triton.Application.Exams.Queries;

namespace Triton.Controllers
{
    [Authorize]
    public class ExamController : BaseController
    {      
        [HttpGet]
        public async Task<IActionResult> GetExams(string courseId)
        {
            return Ok(await Mediator.Send(new GetExamsQuery { CourseId = courseId }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExam(string id)
        {
            return Ok(await Mediator.Send(new GetExamQuery { Id = id }));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> AddExam([FromBody] AddExamCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet("{id}/submission")]
        public async Task<IActionResult> GetExamSubmissions(string id)
        {
            return Ok(await Mediator.Send(new GetExamSubmissionsQuery { Id = id }));
        }

        [HttpPost("{id}/submission")]
        [Authorize(Roles = "Student,Admin")]
        public async Task<IActionResult> SubmitExam(string id, [FromBody] SubmitExamCommand command)
        {
            command.Id = id;

            return Ok(await Mediator.Send(command));
        }
    }
}
