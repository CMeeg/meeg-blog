using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public abstract class StoriesQueryBase
{
    [RequestProperty(Name = StoriesQueryParamName.CacheVersion)]
    public long? CacheVersion { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.Version)]
    public StoryVersion? Version { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveLinks)]
    public ResolveLinksType? ResolveLinks { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveLinksLevel)]
    public int? ResolveLinksLevel { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveRelations, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? ResolveRelations { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.FromRelease)]
    public string? FromRelease { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.FallbackLang)]
    public string? FallbackLang { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.Language)]
    public string? Language { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveAssets)]
    public Bit? ResolveAssets { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveLevel)]
    public Bit? ResolveLevel { get; set; }
}
