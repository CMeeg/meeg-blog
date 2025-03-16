using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery;

namespace WebApp.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class PageHeadingBlock
    : StoryBlock
{
    public const string TechnicalName = "page_heading";

    [JsonPropertyName("title")]
    public required string Title { get; set; }

    [JsonPropertyName("intro")]
    public object? Intro { get; set; }
}
