using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace Triton.Application.Common.Exceptions
{
    public class TritonException : Exception
    {
        public TritonException()
        {

        }

        public TritonException(string key, string message, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        {
            Errors = new Dictionary<string, string[]> { { key, new string[] { message } } };
            StatusCode = statusCode;
        }

        public TritonException(List<ValidationFailure> failures)
            : this()
        {
            var propertyNames = failures
                .Select(e => e.PropertyName)
                .Distinct();

            foreach (var propertyName in propertyNames)
            {
                var propertyFailures = failures
                    .Where(e => e.PropertyName == propertyName)
                    .Select(e => e.ErrorMessage)
                    .ToArray();

                Errors.Add(propertyName, propertyFailures);
            }
        }

        public Dictionary<string, string[]> Errors { get; }
        public HttpStatusCode StatusCode { get; }
    }
}
