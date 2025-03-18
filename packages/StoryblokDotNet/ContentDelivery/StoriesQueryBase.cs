using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public abstract class StoriesQueryBase
{
    [RequestProperty(Name = StoriesQueryParamName.Token)]
    public string? Token { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.CacheVersion)]
    public int? CacheVersion { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.Version)]
    public StoryVersion? Version { get; set; }
}
