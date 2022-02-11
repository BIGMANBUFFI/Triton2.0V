using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Application.Common.Exceptions;
using Triton.Application.Common.Models;

namespace Triton.Application.Students.Commands
{
    public class RemoveStudentCommand : IRequest<BaseResponse>
    {
        public string Id { get; set; }
    }

    public class RemoveStudentCommandHandler : IRequestHandler<RemoveStudentCommand, BaseResponse>
    {
        private readonly DataContext _context;

        public RemoveStudentCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<BaseResponse> Handle(RemoveStudentCommand request, CancellationToken cancellationToken)
        {
            var student = await _context.Students.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (student is null)
                throw new TritonException("Student", "Student doesnt exist");

            _context.Students.Remove(student);

            await _context.SaveChangesAsync();

            return new BaseResponse { Id = student.Id, Success = true };
        }
    }
}
