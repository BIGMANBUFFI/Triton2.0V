namespace Triton.Domain.Users
{
    public class Administrator
    {
        public string Id { get; set; }
        public string UserId { get; set; }

        public User User { get; set; }
    }
}
