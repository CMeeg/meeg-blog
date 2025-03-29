namespace WebApp.Features;

public static class StringExtensions
{
    public static string Coalesce(this string? value, string? with)
    {
        if (string.IsNullOrEmpty(value))
        {
            return with.EmptyIfNull();
        }

        return value;
    }

    public static string EmptyIfNull(this string? value)
    {
        return value ?? string.Empty;
    }
}
