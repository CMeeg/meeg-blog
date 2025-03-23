using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery.Stories;

namespace WebApp.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class PageBlock
    : StoryBlock
{
    public const string TechnicalName = "page";

    [JsonPropertyName("body")]
    public required StoryBlock[] Body { get; set; }
}
