using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery.Stories;

namespace WebApp.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class ArticleListingBlock
    : StoryBlock
{
    public const string TechnicalName = "article_listing";

    [JsonPropertyName("starts_with")]
    public string? StartsWith { get; set; }

    [JsonPropertyName("with_tag")]
    public string? WithTag { get; set; }

    [JsonPropertyName("per_page")]
    public int PerPage { get; set; }
}
