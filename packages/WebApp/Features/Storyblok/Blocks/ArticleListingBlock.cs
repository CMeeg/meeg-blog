using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery.Stories;

namespace WebApp.Features.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class ArticleListingBlock
    : StoryBlock
{
    public const string TechnicalName = "article_listing";

    [JsonPropertyName("starts_with")]
    public string? StartsWith { get; init; }

    [JsonPropertyName("with_tag")]
    public string? WithTag { get; init; }

    [JsonPropertyName("per_page")]
    public int PerPage { get; private set; }

    public ArticleListingBlock(Guid uid, string component, int perPage)
        : base(uid, component)
    {
        PerPage = perPage;
    }
}
