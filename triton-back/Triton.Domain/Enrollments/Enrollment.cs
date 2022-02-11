using System;
using Triton.Domain.Courses;
using Triton.Domain.Users;

namespace Triton.Domain.Enrollments
{
    public class Enrollment
    {
        public string Id { get; set; }
        public string AdministratorId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public string CourseId { get; set; }
        public DateTime ExpiresAt { get; set; }

        public Administrator Administrator { get; set; }
        public Course Course { get; set; }
    }
}
