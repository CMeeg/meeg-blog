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
    public StoryBlock[] Body { get; private set; }
    public SeoMetadataPlugin Metadata { get; private set; }

    public PageBlock(Guid uid, string component, StoryBlock[] body, SeoMetadataPlugin metadata)
        : base(uid, component)
    {
        Body = body;
        Metadata = metadata;
    }
}
