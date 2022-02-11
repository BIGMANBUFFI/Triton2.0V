using System.Collections.Generic;
using Triton.Domain.Courses;
using Triton.Domain.Exams;

namespace Triton.Domain.Users
{
    public class Student
    {
        public string Id { get; set; }
        public string UserId { get; set; }

        public User User { get; set; }
        public List<StudentCourse> StudentCourses { get; set; }
        public List<ExamSubmission> ExamSubmissions { get; set; }
    }
}
