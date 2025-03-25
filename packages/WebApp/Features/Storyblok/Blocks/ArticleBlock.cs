using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery.Stories;

namespace WebApp.Features.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class ArticleBlock
    : StoryBlock
{
    public const string TechnicalName = "article";

    [JsonPropertyName("title")]
    public required string Title { get; set; }
}
