using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery.Stories;

namespace WebApp.Features.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class ArticleBlock
    : StoryBlock
{
    public const string TechnicalName = "article";

    [JsonPropertyName("title")]
    public string Title { get; private set; }

    public ArticleBlock(Guid uid, string component, string title)
        : base(uid, component)
    {
        Title = title;
    }
}
