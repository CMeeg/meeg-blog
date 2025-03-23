using RestSharp;

namespace StoryblokDotNet.ContentDelivery.Stories;

public sealed class StoryQuery
    : StoriesQueryBase
{
    [RequestProperty(Name = StoryQueryParamName.FindBy)]
    public StoryIdentifierType? FindBy { get; set; }
}
