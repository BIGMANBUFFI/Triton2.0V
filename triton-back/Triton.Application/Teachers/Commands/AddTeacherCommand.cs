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

namespace Triton.Application.Teachers.Commands
{
    public class AddTeacherCommand : IRequest<AddTeacherResponse>
    {
        public string FullName { get; set; }
        public string Email { get; set; }
    }

    public class AddTeacherCommandHandler : IRequestHandler<AddTeacherCommand, AddTeacherResponse>
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IPasswordGenerator _passwordGenerator;

        public AddTeacherCommandHandler(DataContext context, UserManager<User> userManager, IPasswordGenerator passwordGenerator)
        {
            _context = context;
            _userManager = userManager;
            _passwordGenerator = passwordGenerator;
        }

        public async Task<AddTeacherResponse> Handle(AddTeacherCommand request, CancellationToken cancellationToken)
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

            var teacher = new Teacher
            {
                Id = Guid.NewGuid().ToString(),
                UserId = loggedInUser.Id
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            await _userManager.AddToRoleAsync(loggedInUser, "Teacher");

            if (!result.Succeeded)
                throw new TritonException();

            return new AddTeacherResponse
            {
                Id = loggedInUser.Id,
                Email = loggedInUser.Email,
                Password = password
            };

        }
    }

    public class AddTeacherResponse
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
