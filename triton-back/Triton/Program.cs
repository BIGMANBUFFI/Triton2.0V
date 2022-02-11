using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading.Tasks;
using Triton.Application.Common.Data;
using Triton.Domain.Users;

namespace Triton
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            var scope = host.Services.CreateScope();
            var serviceProvider = scope.ServiceProvider;

            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
            var dbContext = serviceProvider.GetRequiredService<DataContext>();

            dbContext.Database.Migrate();

            await SeedData(userManager, roleManager, dbContext);

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });


        private async static Task SeedData(UserManager<User> userManager, RoleManager<Role> roleManager, DataContext context)
        {
            if ((await context.Users.ToListAsync()).Count == 0)
            {
                var userOne = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    FullName = "Shendrit Kqiku",
                    Email = "shendrit@test.com",
                    UserName = "shendrit@test.com"
                };

                var userTwo = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    FullName = "Ardi Kastrati",
                    Email = "ard@test.com",
                    UserName = "ard@test.com"
                };

                await userManager.CreateAsync(userOne, "Pa$$w0rd");
                await userManager.CreateAsync(userTwo, "Pa$$w0rd");

                await roleManager.CreateAsync(new Role { Id = Guid.NewGuid().ToString(), Name = "Student" });
                await roleManager.CreateAsync(new Role { Id = Guid.NewGuid().ToString(), Name = "Teacher" });
                await roleManager.CreateAsync(new Role { Id = Guid.NewGuid().ToString(), Name = "Admin" });

                var addedUserOne = await userManager.FindByEmailAsync("shendrit@test.com");
                var addedUserTwo = await userManager.FindByEmailAsync("ard@test.com");

                await userManager.AddToRoleAsync(addedUserOne, "Admin");
                await userManager.AddToRoleAsync(addedUserTwo, "Admin");

                context.Administrators.Add(new Administrator { Id = Guid.NewGuid().ToString(), UserId = userOne.Id });
                context.Administrators.Add(new Administrator { Id = Guid.NewGuid().ToString(), UserId = userTwo.Id });

                await context.SaveChangesAsync();
            }
        }
    }
}
