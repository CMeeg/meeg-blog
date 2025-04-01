using System.Text.Json.Serialization;
using StoryblokDotNet.ContentDelivery.Stories;

namespace WebApp.Features.Storyblok.Blocks;

[StoryBlockType(TechnicalName)]
public class PageHeadingBlock
    : StoryBlock
{
    public const string TechnicalName = "page_heading";

    [JsonPropertyName("title")]
    public string Title { get; private set; }

    [JsonPropertyName("intro")]
    public object? Intro { get; init; }

    public PageHeadingBlock(
        Guid uid,
        string component,
        string title)
        : base(uid, component)
    {
        Title = title;
    }
}
