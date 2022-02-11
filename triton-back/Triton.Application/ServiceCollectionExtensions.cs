using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Triton.Application.Common.Behaviours;
using Triton.Application.Common.Services;

namespace Triton.Application
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddTransient<IPasswordGenerator, PasswordGenerator>();
            services.AddScoped<TokenService>();

            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestValidationBehavior<,>));

            return services;
        }
    }
}
