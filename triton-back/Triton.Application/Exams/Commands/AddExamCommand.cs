using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Application.Common.Models;
using Triton.Domain.Exams;
using Triton.Domain.Exams.Enums;

namespace Triton.Application.Exams.Commands
{
    public class AddExamCommand : IRequest<BaseResponse>
    {
        public string CourseId { get; set; }
        public DateTime StartTime { get; set; }
        public int Duration { get; set; }
        public int PointsToPass { get; set; }
        public List<AddExamQuestion> Questions { get; set; }
    }

    public class AddExamQuestion
    {
        public string Question { get; set; }
        public string Description { get; set; }
        public int Points { get; set; }
        public ExamQuestionType Type { get; set; }
        public List<AddExamQuestionAnswer> Answers { get; set; }
    }

    public class AddExamQuestionAnswer
    {
        public string Answer { get; set; }
        public int Points { get; set; }
        public bool IsCorrect { get; set; }
    }

    public class AddExamCommandHandler : IRequestHandler<AddExamCommand, BaseResponse>
    {
        private readonly DataContext _context;

        public AddExamCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<BaseResponse> Handle(AddExamCommand request, CancellationToken cancellationToken)
        {
            var exams = _context.Exams;

            var exam = new Exam
            {
                Id = Guid.NewGuid().ToString(),
                CourseId = request.CourseId,
                StartTime = request.StartTime.ToUniversalTime(),
                EndTime = request.StartTime.ToUniversalTime().AddMinutes(request.Duration),
                PointsToPass = request.PointsToPass
            };

            exams.Add(exam);

            var examQuestions = _context.ExamsQuestions;
            var examQuestionAnwers = _context.ExamsQuestionsAnswers;

            foreach (var question in request.Questions)
            {
                var examQuestion = new ExamQuestion
                {
                    Id = Guid.NewGuid().ToString(),
                    ExamId = exam.Id,
                    Question = question.Question,
                    Description = question.Description,
                    Points = question.Points,
                    Type = question.Type,
                };

                examQuestions.Add(examQuestion); ;

                foreach (var answer in question.Answers)
                {
                    examQuestionAnwers.Add(new ExamQuestionAnswer
                    {
                        Id = Guid.NewGuid().ToString(),
                        ExamQuestionId = examQuestion.Id,
                        Answer = answer.Answer,
                        Points = answer.Points,
                        IsCorrect = answer.IsCorrect
                    });
                }
            }

            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Id = exam.Id,
                Success = true,
            };
        }
    }
}
