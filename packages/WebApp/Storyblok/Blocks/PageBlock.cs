using System.Text.Json.Serialization;
using Adliance.Storyblok;
using Adliance.Storyblok.Attributes;

namespace WebApp.Storyblok.Blocks;

[StoryblokComponent("page")]
public class PageBlock
    : StoryblokComponent
{
    [JsonPropertyName("body")]
    public required StoryblokComponent[] Body { get; set; }
}
