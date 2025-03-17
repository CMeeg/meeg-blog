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

    // TODO: Implement a "Sort by builder" pattern to make this more convenient
    private string? sortBy;
    public StoriesQueryBuilder SortBy(string? sortBy)
    {
        this.sortBy = sortBy;

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
    public StoriesQueryBuilder BySlugs(params string[]? bySlugs)
    {
        this.bySlugs = bySlugs;

        return this;
    }

    private string[]? excludingSlugs;
    public StoriesQueryBuilder ExcludingSlugs(params string[]? excludingSlugs)
    {
        this.excludingSlugs = excludingSlugs;

        return this;
    }

    // TODO: Other filters...

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

    // TODO: Other filters...

    private string[]? filterQuery;
    public StoriesQueryBuilder FilterBy(FilterQuery? filterQuery)
    {
        if (filterQuery == null)
        {
            this.filterQuery = null;

            return this;
        }

        this.filterQuery = filterQuery.Build();

        return this;
    }

    // TODO: The rest...

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
            WithTag = tags,
            IsStartpage = isStartpage,
            FilterQuery = filterQuery
        };
    }
}
