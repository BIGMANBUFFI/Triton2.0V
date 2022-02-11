using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Application.Common.Interfaces;
using Triton.Application.Common.Models;
using Triton.Domain.Exams;
using Triton.Domain.Exams.Enums;
using Triton.Domain.Users;

namespace Triton.Application.Exams.Commands
{
    public class SubmitExamCommand : IRequest<BaseResponse>
    {
        public string Id { get; set; }
        public List<SubmitExamQuestion> Questions { get; set; }
    }

    public class SubmitExamQuestion
    {
        public string QuestionId { get; set; }
        public List<SubmitExamQuestionAnswer> Answers { get; set; }
    }

    public class SubmitExamQuestionAnswer
    {
        public string AnswerId { get; set; }
    }

    public class SubmitExamCommandHandler : IRequestHandler<SubmitExamCommand, BaseResponse>
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly ICurrentUser _currentUser;

        public SubmitExamCommandHandler(DataContext context, UserManager<User> userManager, ICurrentUser currentUser)
        {
            _context = context;
            _userManager = userManager;
            _currentUser = currentUser;
        }

        public async Task<BaseResponse> Handle(SubmitExamCommand request, CancellationToken cancellationToken)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == _currentUser.GetId());

            var exam = await _context.Exams
                .AsQueryable()
                .AsNoTracking()
                .Include(x => x.Questions)
                    .ThenInclude(x => x.Answers)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

            var examSubmission = new ExamSubmission
            {
                Id = Guid.NewGuid().ToString(),
                ExamId = request.Id,
                StudentId = student.Id,
                SubmittedAt = DateTime.UtcNow,
            };

            int points = 0;

            foreach (var submittedQuestion in request.Questions)
            {
                var examQuestion = exam.Questions.FirstOrDefault(eq => eq.Id == submittedQuestion.QuestionId);
                if (examQuestion == null)
                    continue;

                if (examQuestion.Type == ExamQuestionType.SingleAnswer)
                {
                    var correctAnswer = examQuestion.Answers.FirstOrDefault(x => x.IsCorrect);
                    if (submittedQuestion.Answers.FirstOrDefault(a => a.AnswerId == correctAnswer.Id) != null)
                        points += correctAnswer.Points;
                }
                else if (examQuestion.Type == ExamQuestionType.MultipleAnswers)
                {
                    foreach (var submittedAnswer in submittedQuestion.Answers)
                    {
                        var examAnswer = examQuestion.Answers.FirstOrDefault(a => a.Id == submittedAnswer.AnswerId);
                        if (examAnswer != null && examAnswer.IsCorrect)
                            points += examAnswer.Points;
                    }
                }
            }

            examSubmission.Points = points;
            examSubmission.Passed = points >= exam.PointsToPass;

            _context.ExamSubmissions.Add(examSubmission);

            await _context.SaveChangesAsync();

            return new BaseResponse
            {
                Id = exam.Id,
                Success = true,
            };
        }
    }
}
