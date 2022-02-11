using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Threading.Tasks;
using Triton.Application.Common.Exceptions;

namespace Triton.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                var code = HttpStatusCode.InternalServerError;

                var errors = new Dictionary<string, string[]>();

                if (exception is TritonException tritonException)
                {
                    code = tritonException.StatusCode;
                    errors = tritonException.Errors;
                } else
                {
                    errors.Add("error", new string[] { exception.Message });
                }

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)code;

                var response = JsonConvert.SerializeObject(new
                {
                    errors = errors,
                    title = exception.Message,
                    status = code,
                    traceId = Activity.Current?.Id ?? context?.TraceIdentifier
                });

                await context.Response.WriteAsync(response);
            }
        }
    }

    class ErrorMessageResult
    {
        public string Message { get; set; }
        public Exception Error { get; set; }
    }

}
