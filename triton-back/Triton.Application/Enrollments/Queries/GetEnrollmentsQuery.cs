using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Domain.Enrollments;

namespace Triton.Application.Enrollments.Queries
{
    public class GetEnrollmentsQuery : IRequest<List<Enrollment>>
    {
        public bool? Expired { get; set; }
    }

    public class GetEnrollmentsQueryHandler : IRequestHandler<GetEnrollmentsQuery, List<Enrollment>>
    {
        private readonly DataContext _context;

        public GetEnrollmentsQueryHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Enrollment>> Handle(GetEnrollmentsQuery request, CancellationToken cancellationToken)
        {
            var enrollmentsQuery = _context.Enrollments
               .AsQueryable()
               .Include(x => x.Course)
               .AsNoTracking();

            if (request.Expired != null)
            {
                if (request.Expired == true)
                    enrollmentsQuery = enrollmentsQuery.Where(x => x.ExpiresAt < DateTime.UtcNow);
                else
                    enrollmentsQuery = enrollmentsQuery.Where(x => x.ExpiresAt >= DateTime.UtcNow);
            }

            return await enrollmentsQuery.ToListAsync();
        }
    }
}
