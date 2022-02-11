using System;
using Triton.Domain.Users;

namespace Triton.Domain.Courses
{
    public class StudentCourse
    {
        public string Id { get; set; }
        public string StudentId { get; set; }
        public string CourseId { get; set; }
        public DateTime EnrolledAt { get; set; }
        public int Grade { get; set; }

        public Student Student { get; set; }
        public Course Course { get; set; }
    }
}
