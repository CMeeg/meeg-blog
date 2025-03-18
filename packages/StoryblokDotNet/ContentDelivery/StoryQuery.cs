using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public class StoryQuery
    : StoriesQueryBase
{
    [RequestProperty(Name = StoryQueryParamName.FindBy)]
    public StoryIdentifierType? FindBy { get; set; }

    // TODO: The rest...
}
