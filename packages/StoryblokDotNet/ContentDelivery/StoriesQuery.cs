using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public class StoriesQuery
    : StoriesQueryBase
{
    [RequestProperty(Name = StoriesQueryParam.StartsWith)]
    public string? StartsWith { get; set; }
    [RequestProperty(Name = StoriesQueryParam.SearchTerm)]
    public string? SearchTerm { get; set; }
    [RequestProperty(Name = StoriesQueryParam.SortBy)]
    public string? SortBy { get; set; }
    [RequestProperty(Name = StoriesQueryParam.PerPage)]
    public int? PerPage { get; set; }
    [RequestProperty(Name = StoriesQueryParam.Page)]
    public int? Page { get; set; }
    [RequestProperty(Name = StoriesQueryParam.BySlugs, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? BySlugs { get; set; }
    [RequestProperty(Name = StoriesQueryParam.ExcludingSlugs, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? ExcludingSlugs { get; set; }
    [RequestProperty(Name = StoriesQueryParam.PublishedAtGt, Format = "yyyy-MM-dd HH:mm")]
    public DateTime? PublishedAtGt { get; set; }
    [RequestProperty(Name = StoriesQueryParam.PublishedAtLt, Format = "yyyy-MM-dd HH:mm")]
    public DateTime? PublishedAtLt { get; set; }
    [RequestProperty(Name = StoriesQueryParam.FirstPublishedAtGt, Format = "yyyy-MM-dd HH:mm")]
    public DateTime? FirstPublishedAtGt { get; set; }
    [RequestProperty(Name = StoriesQueryParam.FirstPublishedAtLt, Format = "yyyy-MM-dd HH:mm")]
    public DateTime? FirstPublishedAtLt { get; set; }
    [RequestProperty(Name = StoriesQueryParam.UpdatedAtGt, Format = "yyyy-MM-dd HH:mm")]
    public DateTime? UpdatedAtGt { get; set; }
    [RequestProperty(Name = StoriesQueryParam.UpdatedAtLt, Format = "yyyy-MM-dd HH:mm")]
    public DateTime? UpdatedAtLt { get; set; }

    // TODO: Other filters...

    [RequestProperty(Name = StoriesQueryParam.WithTag, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? WithTag { get; set; }
    [RequestProperty(Name = StoriesQueryParam.IsStartpage)]
    public Bit? IsStartpage { get; set; }

    // TODO: Other filters...

    public string? FilterQuery { get; set; }

    // TODO: The rest...
}
