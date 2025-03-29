using System.Text.Json.Serialization;

namespace WebApp.Features.Storyblok.Plugins;

public class SeoMetadataPlugin
{
    [JsonPropertyName("_uid")]
    public required string Uid { get; set; }
    public required string Plugin { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string OgTitle { get; set; }
    public required string OgDescription { get; set; }
    public required string OgImage { get; set; }
    public required string TwitterTitle { get; set; }
    public required string TwitterDescription { get; set; }
    public required string TwitterImage { get; set; }
}
