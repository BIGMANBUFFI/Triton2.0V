using System;
using Triton.Domain.Users;

namespace Triton.Domain.Exams
{
    public class ExamSubmission
    {
        public string Id { get; set; }
        public string ExamId { get; set; }
        public string StudentId { get; set; }
        public DateTime SubmittedAt { get; set; }
        public int Points { get; set; }
        public bool Passed { get; set; }

        public Exam Exam { get; set; }
        public Student Student { get; set; }
    }
}
