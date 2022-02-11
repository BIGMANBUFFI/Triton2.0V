using System;
using System.Collections.Generic;
using Triton.Domain.Courses;

namespace Triton.Domain.Exams
{
    public class Exam
    {
        public string Id { get; set; }
        public string CourseId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int PointsToPass { get; set; }
        
        public Course Course { get; set; }
        public List<ExamQuestion> Questions { get; set; }
        public List<ExamSubmission> ExamSubmissions { get; set; }
    }
}
