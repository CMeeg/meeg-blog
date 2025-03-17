using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public abstract class StoriesQueryBase
{
    [RequestProperty(Name = StoriesQueryParam.Token)]
    public string? Token { get; set; }
    [RequestProperty(Name = StoriesQueryParam.CacheVersion)]
    public int? CacheVersion { get; set; }
    [RequestProperty(Name = StoriesQueryParam.Version)]
    public StoryVersion? Version { get; set; }
}
