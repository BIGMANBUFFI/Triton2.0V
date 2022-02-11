using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;

namespace Triton.Application.Teachers.Queries
{
    public class GetTeachersQuery : IRequest<List<GetTeachersResult>>
    {

    }

    public class GetTeachersQueryHandler : IRequestHandler<GetTeachersQuery, List<GetTeachersResult>>
    {
        private readonly DataContext _context;

        public GetTeachersQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<List<GetTeachersResult>> Handle(GetTeachersQuery request, CancellationToken cancellationToken)
        {
            var teachers = await _context.Teachers
                .AsQueryable()
                .AsNoTracking()
                .Include(x => x.User)
                .Include(x => x.Courses)
                    .ThenInclude(x => x.Exams)
                .Include(x => x.Courses)
                    .ThenInclude(x => x.Students)
                .ToListAsync();

            var results = new List<GetTeachersResult>();

            foreach (var teacher in teachers)
            {
                results.Add(new GetTeachersResult
                {
                    Id = teacher.Id,
                    FullName = teacher.User.FullName,
                    Email = teacher.User.Email,
                    CoursesCount = teacher.Courses.Count,
                    ExamsCount = teacher.Courses.Sum(x => x.Exams.Count),
                    StudentsCount = teacher.Courses.Sum(x => x.Students.Count)
                });
            }

            return results;
        }
    }

    public class GetTeachersResult
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public int CoursesCount { get; set; }
        public int ExamsCount { get; set; }
        public int StudentsCount { get; set; }
    }
}
