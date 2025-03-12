using System.Text.Json.Serialization;
using Adliance.Storyblok;
using Adliance.Storyblok.Attributes;

namespace WebApp.Storyblok.Blocks;

[StoryblokComponent("article")]
public class ArticleBlock
    : StoryblokComponent
{
    [JsonPropertyName("title")]
    public required string Title { get; set; }
}
