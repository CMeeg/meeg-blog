using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public abstract class StoriesQueryBase
{
    [RequestProperty(Name = StoriesQueryParam.Version)]
    public StoryVersion Version { get; set; } = StoryVersion.Published;
}
