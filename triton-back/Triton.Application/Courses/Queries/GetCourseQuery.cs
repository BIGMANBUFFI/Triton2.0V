using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Domain.Courses;

namespace Triton.Application.Courses.Queries
{
    public class GetCourseQuery : IRequest<Course>
    {
        public string Id { get; set; }
    }

    public class GetCourseQueryHandler : IRequestHandler<GetCourseQuery, Course>
    {
        private readonly DataContext _context;

        public GetCourseQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Course> Handle(GetCourseQuery request, CancellationToken cancellationToken)
        {
            var course = await _context.Courses
                .AsQueryable()
                .AsNoTracking()
                .Include(x => x.Teacher)
                .Include(x => x.Students)
                    .ThenInclude(s => s.User)
                .Include(x => x.Topics)
                .Include(x => x.Exams)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

            return course;
        }
    }
}
