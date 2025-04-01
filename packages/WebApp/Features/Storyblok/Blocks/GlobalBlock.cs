using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery.Stories;
using WebApp.Features.Storyblok.Plugins;

namespace WebApp.Features.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class GlobalBlock
    : StoryBlock
{
    public const string TechnicalName = "global";

    public required Asset Logo { get; set; }
    public string? Copyright { get; set; }
    [JsonPropertyName("github_username")]
    public string? GitHubUsername { get; set; }
    public string? TwitterUsername { get; set; }
    public string? SiteTitle { get; set; }
    public required SeoMetadataPlugin Metadata { get; set; }
}
