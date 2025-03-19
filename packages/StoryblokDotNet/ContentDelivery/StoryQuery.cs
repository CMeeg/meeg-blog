using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryQuery
    : StoriesQueryBase
{
    [RequestProperty(Name = StoryQueryParamName.FindBy)]
    public StoryIdentifierType? FindBy { get; set; }
}
