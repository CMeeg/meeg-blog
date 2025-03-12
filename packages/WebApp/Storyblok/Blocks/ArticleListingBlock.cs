using System.Text.Json.Serialization;
using Adliance.Storyblok;
using Adliance.Storyblok.Attributes;

namespace WebApp.Storyblok.Blocks;

[StoryblokComponent("article_listing")]
public class ArticleListingBlock
    : StoryblokComponent
{
    [JsonPropertyName("starts_with")]
    public string? StartsWith { get; set; }

    [JsonPropertyName("with_tag")]
    public string? WithTag { get; set; }

    [JsonPropertyName("per_page")]
    public int PerPage { get; set; }
}
