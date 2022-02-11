using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Domain.Users;

namespace Triton.Application.Students.Queries
{
    public class GetStudentsQuery : IRequest<List<Student>>
    {
        public string TeacherId { get; set; }
        public string CourseId { get; set; }
    }

    public class GetStudentsQueryHandler : IRequestHandler<GetStudentsQuery, List<Student>>
    {
        private readonly DataContext _context;

        public GetStudentsQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Student>> Handle(GetStudentsQuery request, CancellationToken cancellationToken)
        {
            var studentsQuery = _context.Students
                .AsQueryable()
                .Include(x => x.User)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(request.TeacherId) || !string.IsNullOrWhiteSpace(request.CourseId))
            {
                var students = await studentsQuery
                    .Include(x => x.StudentCourses)
                    .ThenInclude(x => x.Course)
                    .ToListAsync();

                if (!string.IsNullOrWhiteSpace(request.TeacherId))
                    students = students.Where(s => s.StudentCourses.Any(sc => sc.Course.TeacherId == request.TeacherId)).ToList();

                if (!string.IsNullOrWhiteSpace(request.CourseId))
                    students = students.Where(s => s.StudentCourses.Any(sc => sc.CourseId == request.CourseId)).ToList();

                return students;
            }

            return await studentsQuery.ToListAsync();
        }
    }
}
