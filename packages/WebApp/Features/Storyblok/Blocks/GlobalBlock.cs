using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery.Stories;
using WebApp.Features.Storyblok.Plugins;

namespace WebApp.Features.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class GlobalBlock
    : StoryBlock
{
    public const string TechnicalName = "global";

    public Asset Logo { get; private set; }
    public string? Copyright { get; init; }
    [JsonPropertyName("github_username")]
    public string? GitHubUsername { get; init; }
    public string? TwitterUsername { get; init; }
    public string? SiteTitle { get; init; }
    public SeoMetadataPlugin Metadata { get; private set; }

    public GlobalBlock(Guid uid, string component, Asset logo, SeoMetadataPlugin metadata)
        : base(uid, component)
    {
        Logo = logo;
        Metadata = metadata;
    }
}
