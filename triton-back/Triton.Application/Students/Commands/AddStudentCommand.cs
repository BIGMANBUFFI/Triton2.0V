using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Application.Common.Exceptions;
using Triton.Application.Common.Services;
using Triton.Domain.Users;

namespace Triton.Application.Students.Commands
{
    public class AddStudentCommand : IRequest<AddStudentResponse>
    {
        public string FullName { get; set; }
        public string Email { get; set; }
    }

    public class AddStudentCommandHandler : IRequestHandler<AddStudentCommand, AddStudentResponse>
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IPasswordGenerator _passwordGenerator;

        public AddStudentCommandHandler(DataContext context, UserManager<User> userManager, IPasswordGenerator passwordGenerator)
        {
            _context = context;
            _userManager = userManager;
            _passwordGenerator = passwordGenerator;
        }

        public async Task<AddStudentResponse> Handle(AddStudentCommand request, CancellationToken cancellationToken)
        {
            if (await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email) != null)
                throw new TritonException("Email", "Email must be unique", HttpStatusCode.Unauthorized);

            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                FullName = request.FullName,
                UserName = request.Email,
                Email = request.Email,
            };

            var password = _passwordGenerator.GeneratePassword(15);
            var result = await _userManager.CreateAsync(user, password);

            var loggedInUser = await _userManager.FindByEmailAsync(user.Email);

            var student = new Student
            {
                Id = Guid.NewGuid().ToString(),
                UserId = loggedInUser.Id
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            await _userManager.AddToRoleAsync(loggedInUser, "Student");

            if (result.Succeeded)
            {
                return new AddStudentResponse
                {
                    Id = loggedInUser.Id,
                    Email = loggedInUser.Email,
                    Password = password
                };
            }

            throw new TritonException();
        }
    }

    public class AddStudentResponse
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
