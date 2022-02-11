using System.Collections.Generic;
using Triton.Domain.Exams.Enums;

namespace Triton.Domain.Exams
{
    public class ExamQuestion
    {
        public string Id { get; set; }
        public string ExamId { get; set; }
        public string Question { get; set; }
        public string Description { get; set; }
        public int Points { get; set; }
        public ExamQuestionType Type { get; set; }

        public Exam Exam { get; set; }
        public List<ExamQuestionAnswer> Answers { get; set; }
    }
}
