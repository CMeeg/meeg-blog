using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public class StoryQuery
    : StoriesQueryBase
{
    [RequestProperty(Name = StoryQueryParam.FindBy)]
    public StoryIdentifierType? FindBy { get; set; }

    // TODO: The rest...
}
