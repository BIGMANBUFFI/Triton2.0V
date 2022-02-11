namespace Triton.Domain.Courses
{
    public class Topic
    {
        public string Id { get; set; }
        public string CourseId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public Course Course { get; set; }
    }
}
