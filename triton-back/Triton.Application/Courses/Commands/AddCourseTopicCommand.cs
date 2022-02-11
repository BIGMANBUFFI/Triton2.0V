using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Application.Common.Models;
using Triton.Domain.Courses;

namespace Triton.Application.Courses.Commands
{
    public class AddCourseTopicCommand : IRequest<BaseResponse>
    {
        public string CourseId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class AddCourseTopicCommandHandler : IRequestHandler<AddCourseTopicCommand, BaseResponse>
    {
        private readonly DataContext _context;

        public AddCourseTopicCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<BaseResponse> Handle(AddCourseTopicCommand request, CancellationToken cancellationToken)
        {
            var topic = new Topic
            {
                Id = Guid.NewGuid().ToString(),
                CourseId = request.CourseId,
                Name = request.Name,
                Description = request.Description
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Id = topic.Id,
                Success = true,
            };
        }
    }
}
