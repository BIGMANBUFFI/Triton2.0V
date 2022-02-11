using System.Collections.Generic;
using Triton.Domain.Enrollments;
using Triton.Domain.Exams;
using Triton.Domain.Users;

namespace Triton.Domain.Courses
{
    public class Course
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string TeacherId { get; set; }

        public Teacher Teacher { get; set; }
        public List<Student> Students { get; set; }
        public List<Topic> Topics { get; set; }
        public List<Exam> Exams { get; set; }
        public List<Enrollment> Enrollments { get; set; }
    }
}
