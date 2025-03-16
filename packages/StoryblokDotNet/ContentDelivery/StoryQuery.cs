using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public class StoryQuery
    : StoriesQueryBase
{
    [RequestProperty(Name = StoryQueryParam.FindBy)]
    public StoryFindBy? FindBy { get; set; }

    // TODO: The rest...
}
