namespace Triton.Domain.Exams
{
    public class ExamQuestionAnswer
    {
        public string Id { get; set; }
        public string ExamQuestionId { get; set; }
        public string Answer { get; set; }
        public int Points { get; set; }
        public bool IsCorrect { get; set; }

        public ExamQuestion ExamQuestion { get; set; }
    }
}
