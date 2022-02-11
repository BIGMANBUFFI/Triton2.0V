using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Application.Common.Exceptions;
using Triton.Application.Common.Interfaces;
using Triton.Application.Common.Models;
using Triton.Domain.Enrollments;

namespace Triton.Application.Enrollments.Commands
{
    public class AddEnrollmentCommand : IRequest<BaseResponse>
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public string CourseId { get; set; }
        public DateTime ExpiresAt { get; set; }
    }

    public class AddEnrollmentCommandHandler : IRequestHandler<AddEnrollmentCommand, BaseResponse>
    {
        private readonly DataContext _context;
        private readonly ICurrentUser _currentUser;

        public AddEnrollmentCommandHandler(DataContext context, ICurrentUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<BaseResponse> Handle(AddEnrollmentCommand request, CancellationToken cancellationToken)
        {
            var administrator = await _context.Administrators.FirstOrDefaultAsync(a => a.UserId == _currentUser.GetId());
            if (administrator == null)
                throw new TritonException();

            var enrollment = new Enrollment
            {
                Id = Guid.NewGuid().ToString(),
                AdministratorId = administrator.Id,
                Name = request.Name,
                Value = request.Value,
                CourseId = request.CourseId,
                ExpiresAt = request.ExpiresAt,
            };

            _context.Enrollments.Add(enrollment);

            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Id = enrollment.Id,
                Success = true,
            };
        }
    }
}
