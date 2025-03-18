namespace StoryblokDotNet.ContentDelivery;

public class StoriesQueryBuilder
{
    private string? token;
    public StoriesQueryBuilder Token(string? token)
    {
        this.token = token;

        return this;
    }

    private int? cacheVersion;
    public StoriesQueryBuilder CacheVersion(int? cacheVersion)
    {
        this.cacheVersion = cacheVersion;

        return this;
    }

    private StoryVersion? version;
    public StoriesQueryBuilder Version(StoryVersion? version)
    {
        this.version = version;

        return this;
    }

    private string? startsWith;
    public StoriesQueryBuilder StartsWith(string? startsWith)
    {
        this.startsWith = startsWith;

        return this;
    }

    private string? searchTerm;
    public StoriesQueryBuilder SearchTerm(string? searchTerm)
    {
        this.searchTerm = searchTerm;

        return this;
    }

    private string? sortBy;
    public StoriesQueryBuilder SortBy(string? sortBy)
    {
        this.sortBy = sortBy;

        return this;
    }

    public StoriesQueryBuilder SortBy(ISortExpression? expression)
    {
        if (expression == null)
        {
            sortBy = null;

            return this;
        }

        sortBy = expression.ToString();

        return this;
    }

    private int? perPage;
    public StoriesQueryBuilder PerPage(int? perPage)
    {
        this.perPage = perPage;

        return this;
    }

    private int? page;
    public StoriesQueryBuilder Page(int? page)
    {
        this.page = page;

        return this;
    }

    private string[]? bySlugs;
    public StoriesQueryBuilder BySlugs(params string[]? slugs)
    {
        bySlugs = slugs;

        return this;
    }

    private string[]? excludingSlugs;
    public StoriesQueryBuilder ExcludingSlugs(params string[]? slugs)
    {
        excludingSlugs = slugs;

        return this;
    }

    private DateTime? publishedAtGt;
    public StoriesQueryBuilder PublishedAtGt(DateTime? publishedAtGt)
    {
        this.publishedAtGt = publishedAtGt;

        return this;
    }

    private DateTime? publishedAtLt;
    public StoriesQueryBuilder PublishedAtLt(DateTime? publishedAtLt)
    {
        this.publishedAtLt = publishedAtLt;

        return this;
    }

    private DateTime? firstPublishedAtGt;
    public StoriesQueryBuilder FirstPublishedAtGt(DateTime? firstPublishedAtGt)
    {
        this.firstPublishedAtGt = firstPublishedAtGt;

        return this;
    }

    private DateTime? firstPublishedAtLt;
    public StoriesQueryBuilder FirstPublishedAtLt(DateTime? firstPublishedAtLt)
    {
        this.firstPublishedAtLt = firstPublishedAtLt;

        return this;
    }

    private DateTime? updatedAtGt;
    public StoriesQueryBuilder UpdatedAtGt(DateTime? updatedAtGt)
    {
        this.updatedAtGt = updatedAtGt;

        return this;
    }

    private DateTime? updatedAtLt;
    public StoriesQueryBuilder UpdatedAtLt(DateTime? updatedAtLt)
    {
        this.updatedAtLt = updatedAtLt;

        return this;
    }

    private int[]? inWorkflowStages;
    public StoriesQueryBuilder InWorkflowStages(params int[]? workflowStages)
    {
        inWorkflowStages = workflowStages;

        return this;
    }

    private string? contentType;
    public StoriesQueryBuilder ContentType(string? contentType)
    {
        this.contentType = contentType;

        return this;
    }

    private int? level;
    public StoriesQueryBuilder Level(int? level)
    {
        this.level = level;

        return this;
    }

    private string[]? resolveRelations;
    public StoriesQueryBuilder ResolveRelations(params string[]? relations)
    {
        resolveRelations = relations;

        return this;
    }

    private int[]? excludingIds;
    public StoriesQueryBuilder ExcludingIds(params int[]? ids)
    {
        excludingIds = ids;

        return this;
    }

    private Guid[]? byUuids;
    public StoriesQueryBuilder ByUuids(params Guid[]? uuids)
    {
        byUuids = uuids;

        return this;
    }

    private Guid[]? byUuidsOrdered;
    public StoriesQueryBuilder ByUuidsOrdered(params Guid[]? uuids)
    {
        byUuidsOrdered = uuids;

        return this;
    }

    private string[]? tags;
    public StoriesQueryBuilder Tags(params string[]? tags)
    {
        this.tags = tags;

        return this;
    }

    private Bit? isStartpage;
    public StoriesQueryBuilder IsStartpage(bool? isStartpage)
    {
        if (isStartpage == null)
        {
            this.isStartpage = null;

            return this;
        }

        this.isStartpage = isStartpage.Value;

        return this;
    }

    private ResolveLinksType? resolveLinks;
    public StoriesQueryBuilder ResolveLinks(ResolveLinksType? resolveLinks)
    {
        this.resolveLinks = resolveLinks;

        return this;
    }

    private int? resolveLinksLevel;
    public StoriesQueryBuilder ResolveLinksLevel(int? resolveLinksLevel)
    {
        this.resolveLinksLevel = resolveLinksLevel;

        return this;
    }

    private string? fromRelease;
    public StoriesQueryBuilder FromRelease(string? release)
    {
        fromRelease = release;

        return this;
    }

    private string? fallbackLang;
    public StoriesQueryBuilder FallbackLang(string? fallbackLang)
    {
        this.fallbackLang = fallbackLang;

        return this;
    }

    private string? language;
    public StoriesQueryBuilder Language(string? language)
    {
        this.language = language;

        return this;
    }

    private string? filterQuery;
    public StoriesQueryBuilder FilterBy(string? filterQuery)
    {
        this.filterQuery = filterQuery;

        return this;
    }

    public StoriesQueryBuilder FilterBy(IFilterExpression? expression)
    {
        if (expression == null)
        {
            filterQuery = null;

            return this;
        }

        filterQuery = expression.ToString();

        return this;
    }

    private string[]? excludingFields;
    public StoriesQueryBuilder ExcludingFields(params string[]? fields)
    {
        excludingFields = fields;

        return this;
    }

    private Bit? resolveAssets;
    public StoriesQueryBuilder ResolveAssets(bool? resolveAssets)
    {
        if (resolveAssets == null)
        {
            this.resolveAssets = null;

            return this;
        }

        this.resolveAssets = resolveAssets.Value;

        return this;
    }

    private Bit? resolveLevel;
    public StoriesQueryBuilder ResolveLevel(bool? resolveLevel)
    {
        if (resolveLevel == null)
        {
            this.resolveLevel = null;

            return this;
        }

        this.resolveLevel = resolveLevel.Value;

        return this;
    }

    public StoriesQuery Build()
    {
        return new StoriesQuery
        {
            Token = token,
            CacheVersion = cacheVersion,
            Version = version,
            StartsWith = startsWith,
            SearchTerm = searchTerm,
            SortBy = sortBy,
            PerPage = perPage,
            Page = page,
            BySlugs = bySlugs,
            ExcludingSlugs = excludingSlugs,
            PublishedAtGt = publishedAtGt,
            PublishedAtLt = publishedAtLt,
            FirstPublishedAtGt = firstPublishedAtGt,
            FirstPublishedAtLt = firstPublishedAtLt,
            UpdatedAtGt = updatedAtGt,
            UpdatedAtLt = updatedAtLt,
            InWorkflowStages = inWorkflowStages,
            ContentType = contentType,
            Level = level,
            ResolveRelations = resolveRelations,
            ExcludingIds = excludingIds,
            ByUuids = byUuids,
            ByUuidsOrdered = byUuidsOrdered,
            WithTag = tags,
            IsStartpage = isStartpage,
            ResolveLinks = resolveLinks,
            ResolveLinksLevel = resolveLinksLevel,
            FromRelease = fromRelease,
            FallbackLang = fallbackLang,
            Language = language,
            FilterQuery = filterQuery,
            ExcludingFields = excludingFields,
            ResolveAssets = resolveAssets,
            ResolveLevel = resolveLevel
        };
    }
}
