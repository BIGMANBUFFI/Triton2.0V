using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Triton.Application.Common.Data;
using Triton.Domain.Users;

namespace Triton.Infrastructure
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentityCore<User>()
               .AddRoles<Role>()
               .AddEntityFrameworkStores<DataContext>()
               .AddSignInManager<SignInManager<User>>();

            return services;
        }
    }
}
