namespace Triton.Application.Common.Services
{
    public interface IPasswordGenerator
    {
        string GeneratePassword(int length);
    }
}
