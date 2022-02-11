using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Domain.Exams;

namespace Triton.Application.Exams.Queries
{
    public class GetExamQuery : IRequest<Exam>
    {
        public string Id { get; set; }
    }

    public class GetExamQueryHandler : IRequestHandler<GetExamQuery, Exam>
    {
        private readonly DataContext _context;

        public GetExamQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Exam> Handle(GetExamQuery request, CancellationToken cancellationToken)
        {
            return await _context.Exams
               .AsQueryable()
               .AsNoTracking()
               .Include(x => x.Course)
               .Include(x => x.Questions)
                   .ThenInclude(x => x.Answers)
               .FirstOrDefaultAsync(x => x.Id == request.Id);
        }
    }
}
