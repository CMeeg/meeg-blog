namespace StoryblokDotNet.ContentDelivery;

public class StoriesQueryBuilder
{
    private StoryVersion version = StoryVersion.Published;
    public StoriesQueryBuilder Version(StoryVersion version)
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
    public StoriesQueryBuilder BySlugs(IEnumerable<string> bySlugs)
    {
        if (bySlugs == null)
        {
            this.bySlugs = null;

            return this;
        }

        this.bySlugs = [.. bySlugs];

        return this;
    }

    private string[]? excludingSlugs;
    public StoriesQueryBuilder ExcludingSlugs(IEnumerable<string> excludingSlugs)
    {
        if (excludingSlugs == null)
        {
            this.excludingSlugs = null;

            return this;
        }

        this.excludingSlugs = [.. excludingSlugs];

        return this;
    }

    // TODO: Other filters...

    private string[]? tags;
    public StoriesQueryBuilder Tag(string? tag)
    {
        if (string.IsNullOrEmpty(tag))
        {
            tags = null;

            return this;
        }

        tags = [tag];

        return this;
    }

    public StoriesQueryBuilder Tags(IEnumerable<string> tags)
    {
        if (tags == null)
        {
            this.tags = null;

            return this;
        }

        this.tags = [.. tags];

        return this;
    }

    private Bit? isStartPage;
    public StoriesQueryBuilder IsStartPage(bool? isStartPage)
    {
        if (isStartPage == null)
        {
            this.isStartPage = null;

            return this;
        }

        this.isStartPage = isStartPage.Value;

        return this;
    }

    // TODO: Other filters...

    private string? filterQuery;
    public StoriesQueryBuilder FilterBy(IFilterQuery? filterQuery)
    {
        if (filterQuery == null)
        {
            this.filterQuery = null;

            return this;
        }

        this.filterQuery = filterQuery.ToString();

        return this;
    }

    // TODO: The rest...

    public StoriesQuery Build()
    {
        return new StoriesQuery
        {
            Version = version,
            StartsWith = startsWith,
            SearchTerm = searchTerm,
            SortBy = sortBy,
            PerPage = perPage,
            Page = page,
            BySlugs = bySlugs,
            ExcludingSlugs = excludingSlugs,
            WithTag = tags,
            FilterQuery = filterQuery
        };
    }
}
