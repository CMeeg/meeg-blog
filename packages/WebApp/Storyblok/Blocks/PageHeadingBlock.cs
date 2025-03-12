using System.Text.Json.Serialization;
using Adliance.Storyblok;
using Adliance.Storyblok.Attributes;

namespace WebApp.Storyblok.Blocks;

[StoryblokComponent("page_heading")]
public class PageHeadingBlock
    : StoryblokComponent
{
    [JsonPropertyName("title")]
    public required string Title { get; set; }

    [JsonPropertyName("intro")]
    public object? Intro { get; set; }
}
