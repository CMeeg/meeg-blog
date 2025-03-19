using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace StoryblokDotNet;

// Adapted from https://khalidabuhakmeh.com/read-and-convert-querycollection-values-in-aspnet
public static class IQueryCollectionExtensions
{
    public static T[] All<T>(
        this IQueryCollection collection,
        string key)
    {
        var values = new List<T>();

        if (collection.TryGetValue(key, out StringValues results))
        {
            foreach (string? s in results)
            {
                if (s == null)
                {
                    continue;
                }

                try
                {
                    var result = (T) Convert.ChangeType(s, typeof(T), CultureInfo.InvariantCulture);

                    values.Add(result);
                }
                catch (Exception)
                {
                    // TODO: Throw?
                    // Conversion failed - skip value
                }
            }
        }

        return values.ToArray();
    }

    public static T? Get<T>(
        this IQueryCollection collection,
        string key,
        T? @default = default)
    {
        T[] values = All<T>(collection, key);
        T? value = @default;

        if (values.Length > 0)
        {
            value = values[0];
        }

        return value ?? @default;
    }
}
