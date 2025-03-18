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
    [RequestProperty(Name = StoriesQueryParamName.InWorkflowStages, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public int[]? InWorkflowStages { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ContentType)]
    public string? ContentType { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.Level)]
    public int? Level { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveRelations, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? ResolveRelations { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ExcludingIds, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public int[]? ExcludingIds { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ByUuids, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public Guid[]? ByUuids { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ByUuidsOrdered, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public Guid[]? ByUuidsOrdered { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.WithTag, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? WithTag { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.IsStartpage)]
    public Bit? IsStartpage { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveLinks)]
    public ResolveLinksType? ResolveLinks { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveLinksLevel)]
    public int? ResolveLinksLevel { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.FromRelease)]
    public string? FromRelease { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.FallbackLang)]
    public string? FallbackLang { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.Language)]
    public string? Language { get; set; }
    public string? FilterQuery { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ExcludingFields, ArrayQueryType = RequestArrayQueryType.CommaSeparated)]
    public string[]? ExcludingFields { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveAssets)]
    public Bit? ResolveAssets { get; set; }
    [RequestProperty(Name = StoriesQueryParamName.ResolveLevel)]
    public Bit? ResolveLevel { get; set; }
}
