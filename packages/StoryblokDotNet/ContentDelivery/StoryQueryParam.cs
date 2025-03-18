using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryQueryParam
    : SmartEnum<StoryQueryParam, string>
{
    public static readonly StoryQueryParam Token = new(nameof(Token), StoryQueryParamName.Token);
    public static readonly StoryQueryParam CacheVersion = new(nameof(CacheVersion), StoryQueryParamName.CacheVersion);
    public static readonly StoryQueryParam Version = new(nameof(Version), StoryQueryParamName.Version);
    public static readonly StoryQueryParam FindBy = new(nameof(FindBy), StoryQueryParamName.FindBy);

    private StoryQueryParam(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public static class StoryQueryParamName
{
    public const string Token = "token";
    public const string CacheVersion = "cv";
    public const string Version = "version";
    public const string FindBy = "find_by";
}
