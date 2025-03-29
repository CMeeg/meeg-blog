using System.Globalization;

namespace WebApp.Features.Pages.Layout;

public class OpenGraphMetadata
{
    public string Type { get; set; } = OpenGraphType.Website;
    public required string Title { get; set; }
    public required string Image { get; set; }
    public required string Url { get; set; }
    public string Locale { get; set; } = CultureInfo.CurrentCulture.Name.Replace("-", "_");
    public string? SiteName { get; set; }
    public string? Description { get; set; }
}

public static class OpenGraphType
{
    public const string Website = "website";
    public const string Article = "article";
    public const string Profile = "profile";
}
