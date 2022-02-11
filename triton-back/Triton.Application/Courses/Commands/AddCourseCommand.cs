using FluentValidation;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Application.Common.Models;
using Triton.Domain.Courses;

namespace Triton.Application.Courses.Commands
{
    public class AddCourseCommand : IRequest<BaseResponse>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string TeacherId { get; set; }
    }

    public class AddCourseCommandValidator : AbstractValidator<AddCourseCommand>
    {
        public AddCourseCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.TeacherId).NotEmpty();
        }
    }

    public class AddCourseCommandHandler : IRequestHandler<AddCourseCommand, BaseResponse>
    {
        private readonly DataContext _context;

        public AddCourseCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<BaseResponse> Handle(AddCourseCommand request, CancellationToken cancellationToken)
        {
            var course = new Course
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                Description = request.Description,
                TeacherId = request.TeacherId
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Id = course.Id,
                Success = true
            };
        }
    }
}
