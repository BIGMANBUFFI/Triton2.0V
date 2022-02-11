using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Triton.Domain.Courses;
using Triton.Domain.Enrollments;
using Triton.Domain.Exams;
using Triton.Domain.Users;

namespace Triton.Application.Common.Data
{
    public class DataContext : IdentityDbContext<User, Role, string>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Administrator> Administrators { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamSubmission> ExamSubmissions { get; set; }
        public DbSet<ExamQuestion> ExamsQuestions { get; set; }
        public DbSet<ExamQuestionAnswer> ExamsQuestionsAnswers { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<StudentCourse> StudentCourses { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(u => u.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ExamSubmission>()
                .HasOne(e => e.Student)
                .WithMany(c => c.ExamSubmissions)
                .HasForeignKey(u => u.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<StudentCourse>()
                .HasOne(e => e.Student)
                .WithMany(c => c.StudentCourses)
                .HasForeignKey(u => u.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
