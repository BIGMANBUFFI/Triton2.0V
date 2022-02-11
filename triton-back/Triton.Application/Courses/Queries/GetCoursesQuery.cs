using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Domain.Courses;
using Triton.Domain.Users;

namespace Triton.Application.Courses.Queries
{
    public class GetCoursesQuery : IRequest<List<GetCoursesResult>>
    {

    }

    public class GetCoursesQueryHandler : IRequestHandler<GetCoursesQuery, List<GetCoursesResult>>
    {
        private readonly DataContext _context;

        public GetCoursesQueryHandler(DataContext context)
        {
            _context=context;
        }

        public async Task<List<GetCoursesResult>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
        {
            var courses = await _context.Courses
                .AsQueryable()
                .AsNoTracking()
                .Include(x => x.Teacher)
                    .ThenInclude(x => x.User)
                .Include(x => x.Students)
                .Include(x => x.Topics)
                .Include(x => x.Exams)
                .ToListAsync();

            var results = new List<GetCoursesResult>();

            foreach (var course in courses)
            {
                results.Add(new GetCoursesResult
                {
                    Id = course.Id,
                    Name = course.Name,
                    Teacher = course.Teacher,
                    StudentsCount = course.Students.Count,
                    TopicsCount = course.Topics.Count,
                    ExamsCount = course.Exams.Count,
                    Topics = course.Topics
                });
            }

            return results;
        }
    }

    public class GetCoursesResult
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Teacher Teacher { get; set; }
        public int StudentsCount { get; set; }
        public int TopicsCount { get; set; }
        public List<Topic> Topics { get; set; }
        public int ExamsCount { get; set; }
    }
}
