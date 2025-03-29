using System.Globalization;

namespace WebApp.Features.Pages.Layout;

public class PageMetadata
{
    public IFormatProvider? FormatProvider { get; set; } = CultureInfo.CurrentCulture;
    public string? Title { get; set; }
    public string? TitleTemplate { get; set; }
    public string? FullTitle => string.IsNullOrEmpty(TitleTemplate)
        ? Title
        : string.Format(FormatProvider, TitleTemplate, Title);
    public string? Description { get; set; }
    public string? CanonicalUrl { get; set; }
}
