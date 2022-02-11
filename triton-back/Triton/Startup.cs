using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Net.Mime;
using System.Reflection;
using System.Text;
using Triton.Application;
using Triton.Application.Account.Queries;
using Triton.Application.Common.Interfaces;
using Triton.Application.Courses.Commands;
using Triton.Domain.Courses;
using Triton.Domain.Users;
using Triton.Infrastructure;
using Triton.Middlewares;

namespace Triton
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers()
                .ConfigureApiBehaviorOptions(options =>
                {
                    options.InvalidModelStateResponseFactory = context =>
                    {
                        var result = new BadRequestObjectResult(context.ModelState);

                        result.ContentTypes.Add(MediaTypeNames.Application.Json);
                        return result;
                    };
                })
            .AddFluentValidation(fv =>
               fv.RegisterValidatorsFromAssemblyContaining<AddCourseCommand>())
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowAnyOrigin();
                });
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Triton", Version = "v1" });
            });

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecretTokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                     .AddJwtBearer(options =>
                     {
                         options.TokenValidationParameters = new TokenValidationParameters
                         {
                             ValidateIssuerSigningKey = true,
                             IssuerSigningKey = key,
                             ValidateIssuer = false,
                             ValidateAudience = false,
                         };
                     });

            services.AddApplication();
            services.AddInfrastructure(Configuration);

            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentUser, CurrentUser>();

            services.AddAutoMapper(typeof(Course).Assembly);
            services.AddMediatR(typeof(GetCurrentUserQuery).Assembly);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Triton v1"));
            }

            app.UseCors("CorsPolicy");
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
