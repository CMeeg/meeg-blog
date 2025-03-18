using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoriesQueryParam
    : SmartEnum<StoriesQueryParam, string>
{
    public static readonly StoriesQueryParam Token = new(nameof(Token), StoriesQueryParamName.Token);
    public static readonly StoriesQueryParam CacheVersion = new(nameof(CacheVersion), StoriesQueryParamName.CacheVersion);
    public static readonly StoriesQueryParam Version = new(nameof(Version), StoriesQueryParamName.Version);
    public static readonly StoriesQueryParam StartsWith = new(nameof(StartsWith), StoriesQueryParamName.StartsWith);
    public static readonly StoriesQueryParam SearchTerm = new(nameof(SearchTerm), StoriesQueryParamName.SearchTerm);
    public static readonly StoriesQueryParam SortBy = new(nameof(SortBy), StoriesQueryParamName.SortBy);
    public static readonly StoriesQueryParam PerPage = new(nameof(PerPage), StoriesQueryParamName.PerPage);
    public static readonly StoriesQueryParam Page = new(nameof(Page), StoriesQueryParamName.Page);
    public static readonly StoriesQueryParam BySlugs = new(nameof(BySlugs), StoriesQueryParamName.BySlugs);
    public static readonly StoriesQueryParam ExcludingSlugs = new(nameof(ExcludingSlugs), StoriesQueryParamName.ExcludingSlugs);
    public static readonly StoriesQueryParam PublishedAtGt = new(nameof(PublishedAtGt), StoriesQueryParamName.PublishedAtGt);
    public static readonly StoriesQueryParam PublishedAtLt = new(nameof(PublishedAtLt), StoriesQueryParamName.PublishedAtLt);
    public static readonly StoriesQueryParam FirstPublishedAtGt = new(nameof(FirstPublishedAtGt), StoriesQueryParamName.FirstPublishedAtGt);
    public static readonly StoriesQueryParam FirstPublishedAtLt = new(nameof(FirstPublishedAtLt), StoriesQueryParamName.FirstPublishedAtLt);
    public static readonly StoriesQueryParam UpdatedAtGt = new(nameof(UpdatedAtGt), StoriesQueryParamName.UpdatedAtGt);
    public static readonly StoriesQueryParam UpdatedAtLt = new(nameof(UpdatedAtLt), StoriesQueryParamName.UpdatedAtLt);
    public static readonly StoriesQueryParam WithTag = new(nameof(WithTag), StoriesQueryParamName.WithTag);
    public static readonly StoriesQueryParam IsStartpage = new(nameof(IsStartpage), StoriesQueryParamName.IsStartpage);
    public static readonly StoriesQueryParam FilterQuery = new(nameof(FilterQuery), StoriesQueryParamName.FilterQuery);

    private StoriesQueryParam(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public static class StoriesQueryParamName
{
    public const string Token = "token";
    public const string CacheVersion = "cv";
    public const string Version = "version";
    public const string StartsWith = "starts_with";
    public const string SearchTerm = "search_term";
    public const string SortBy = "sort_by";
    public const string PerPage = "per_page";
    public const string Page = "page";
    public const string BySlugs = "by_slugs";
    public const string ExcludingSlugs = "excluding_slugs";
    public const string PublishedAtGt = "published_at_gt";
    public const string PublishedAtLt = "published_at_lt";
    public const string FirstPublishedAtGt = "first_published_at_gt";
    public const string FirstPublishedAtLt = "first_published_at_lt";
    public const string UpdatedAtGt = "updated_at_gt";
    public const string UpdatedAtLt = "updated_at_lt";
    public const string WithTag = "with_tag";
    public const string IsStartpage = "is_startpage";
    public const string FilterQuery = "filter_query";
}
