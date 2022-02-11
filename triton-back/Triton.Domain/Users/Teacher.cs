using System.Collections.Generic;
using Triton.Domain.Courses;

namespace Triton.Domain.Users
{
    public class Teacher
    {
        public string Id { get; set; }
        public string UserId { get; set; }

        public User User { get; set; }
        public List<Course> Courses { get; set; }
    }
}
