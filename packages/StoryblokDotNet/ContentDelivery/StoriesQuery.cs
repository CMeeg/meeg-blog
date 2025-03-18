using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public class StoriesQuery
    : StoriesQueryBase
{
    private const string DateFormat = "yyyy-MM-dd HH:mm";

    [RequestProperty(Name = StoriesQueryParamName.StartsWith)]
    public string? StartsWith { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.SearchTerm)]
    public string? SearchTerm { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.SortBy)]
    public string? SortBy { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.PerPage)]
    public int? PerPage { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.Page)]
    public int? Page { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.BySlugs, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? BySlugs { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ExcludingSlugs, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? ExcludingSlugs { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.PublishedAtGt, Format = DateFormat)]
    public DateTime? PublishedAtGt { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.PublishedAtLt, Format = DateFormat)]
    public DateTime? PublishedAtLt { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.FirstPublishedAtGt, Format = DateFormat)]
    public DateTime? FirstPublishedAtGt { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.FirstPublishedAtLt, Format = DateFormat)]
    public DateTime? FirstPublishedAtLt { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.UpdatedAtGt, Format = DateFormat)]
    public DateTime? UpdatedAtGt { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.UpdatedAtLt, Format = DateFormat)]
    public DateTime? UpdatedAtLt { get; set; }

    // TODO: Other filters...

    [RequestProperty(Name = StoriesQueryParamName.WithTag, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? WithTag { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.IsStartpage)]
    public Bit? IsStartpage { get; set; }

    // TODO: Other filters...
    public string? FilterQuery { get; set; }

    // TODO: The rest...
}
