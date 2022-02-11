using Microsoft.AspNetCore.Identity;
using System;

namespace Triton.Domain.Users
{
    public class User : IdentityUser<string>
    {
        public string FullName { get; set; }
        public string Address { get; set; }
        public char Gender { get; set; }
        public DateTime Birthday { get; set; }
        public DateTime InsertedAt { get; set; }
    }
}
