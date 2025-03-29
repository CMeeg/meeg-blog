using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery.Stories;
using WebApp.Features.Storyblok.Plugins;

namespace WebApp.Features.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class PageBlock
    : StoryBlock
{
    public const string TechnicalName = "page";

    [JsonPropertyName("body")]
    public required StoryBlock[] Body { get; set; }
    public required SeoMetadataPlugin Metadata { get; set; }
}
