using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryQueryParam
    : SmartEnum<StoryQueryParam, string>
{
    public static readonly StoryQueryParam CacheVersion = new(nameof(CacheVersion), StoryQueryParamName.CacheVersion);
    public static readonly StoryQueryParam Version = new(nameof(Version), StoryQueryParamName.Version);
    public static readonly StoryQueryParam FindBy = new(nameof(FindBy), StoryQueryParamName.FindBy);
    public static readonly StoryQueryParam ResolveLinks = new(nameof(ResolveLinks), StoryQueryParamName.ResolveLinks);
    public static readonly StoryQueryParam ResolveLinksLevel = new(nameof(ResolveLinksLevel), StoryQueryParamName.ResolveLinksLevel);
    public static readonly StoryQueryParam ResolveRelations = new(nameof(ResolveRelations), StoryQueryParamName.ResolveRelations);
    public static readonly StoryQueryParam FromRelease = new(nameof(FromRelease), StoryQueryParamName.FromRelease);
    public static readonly StoryQueryParam FallbackLang = new(nameof(FallbackLang), StoryQueryParamName.FallbackLang);
    public static readonly StoryQueryParam Language = new(nameof(Language), StoryQueryParamName.Language);
    public static readonly StoryQueryParam ResolveAssets = new(nameof(ResolveAssets), StoryQueryParamName.ResolveAssets);
    public static readonly StoryQueryParam ResolveLevel = new(nameof(ResolveLevel), StoryQueryParamName.ResolveLevel);

    private StoryQueryParam(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public static class StoryQueryParamName
{
    public const string CacheVersion = StoriesQueryParamName.CacheVersion;
    public const string Version = StoriesQueryParamName.Version;
    public const string FindBy = "find_by";
    public const string ResolveLinks = StoriesQueryParamName.ResolveLinks;
    public const string ResolveLinksLevel = StoriesQueryParamName.ResolveLinksLevel;
    public const string ResolveRelations = StoriesQueryParamName.ResolveRelations;
    public const string FromRelease = StoriesQueryParamName.FromRelease;
    public const string FallbackLang = StoriesQueryParamName.FallbackLang;
    public const string Language = StoriesQueryParamName.Language;
    public const string ResolveAssets = StoriesQueryParamName.ResolveAssets;
    public const string ResolveLevel = StoriesQueryParamName.ResolveLevel;
}
