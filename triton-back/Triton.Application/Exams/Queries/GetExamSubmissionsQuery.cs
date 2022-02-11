using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Application.Common.Interfaces;
using Triton.Domain.Exams;
using Triton.Domain.Users;

namespace Triton.Application.Exams.Queries
{
    public class GetExamSubmissionsQuery : IRequest<List<ExamSubmission>>
    {
        public string Id { get; set; }
    }

    public class GetExamSubmissionsQueryHandler : IRequestHandler<GetExamSubmissionsQuery, List<ExamSubmission>>
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ICurrentUser _currentUser;

        public GetExamSubmissionsQueryHandler(DataContext context, UserManager<User> userManager, ICurrentUser currentUser)
        {
            _context = context;
            _userManager = userManager;
            _currentUser = currentUser;
        }

        public async Task<List<ExamSubmission>> Handle(GetExamSubmissionsQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.GetUserAsync(_currentUser.GetClaimsPrincipal());

            var userRoles = await _userManager.GetRolesAsync(user);

            var examSubmissionsQuery = _context.ExamSubmissions
                .AsQueryable()
                .Where(es => es.ExamId == request.Id)
                .Include(x => x.Student)
                    .ThenInclude(x => x.User);

            if (userRoles.Contains("Student"))
            {
                var student = await _context.Students.FirstOrDefaultAsync(x => x.UserId == _currentUser.GetId());

                examSubmissionsQuery.Where(x => x.StudentId == student.Id);
            }
            else if (userRoles.Contains("Teacher"))
            {
                var teacher = await _context.Teachers.FirstOrDefaultAsync(x => x.UserId == _currentUser.GetId());

                examSubmissionsQuery
                    .Include(x => x.Exam)
                        .ThenInclude(y => y.Course)
                    .Where(x => x.Exam.Course.TeacherId == teacher.Id);
            }

            return await examSubmissionsQuery.ToListAsync();
        }
    }
}
