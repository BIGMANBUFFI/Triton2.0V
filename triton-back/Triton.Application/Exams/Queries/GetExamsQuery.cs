using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Domain.Courses;

namespace Triton.Application.Exams.Queries
{
    public class GetExamsQuery : IRequest<List<GetExamsResult>>
    {
        public string CourseId { get; set; }
    }

    public class GetExamsQueryHandler : IRequestHandler<GetExamsQuery, List<GetExamsResult>>
    {
        private readonly DataContext _context;

        public GetExamsQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<List<GetExamsResult>> Handle(GetExamsQuery request, CancellationToken cancellationToken)
        {
            var examsQuery = _context.Exams
                .AsQueryable()
                .AsNoTracking();

            if (request.CourseId != default)
                examsQuery = examsQuery.Where(x => x.CourseId == request.CourseId);

            examsQuery = examsQuery
                .Include(x => x.Course)
                .Include(x => x.Questions);

            var exams = await examsQuery.ToListAsync();
            return exams.Select(e => new GetExamsResult
            {
                Id = e.Id,
                Course = e.Course,
                EndTime = e.EndTime,
                QuestionCount = e.Questions.Count,
                StartTime = e.StartTime
            }).ToList();
        }
    }

    public class GetExamsResult
    {
        public string Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public Course Course { get; set; }
        public int QuestionCount { get; set; }
    }
}
