namespace StoryblokDotNet.ContentDelivery;

public class StoryQueryBuilder
{
    private string? token;
    public StoryQueryBuilder Token(string? token)
    {
        this.token = token;

        return this;
    }

    private int? cacheVersion;
    public StoryQueryBuilder CacheVersion(int? cacheVersion)
    {
        this.cacheVersion = cacheVersion;

        return this;
    }

    private StoryVersion? version;
    public StoryQueryBuilder Version(StoryVersion? version)
    {
        this.version = version;

        return this;
    }

    private StoryIdentifierType? findBy;
    public StoryQueryBuilder FindBy(StoryIdentifierType? findBy)
    {
        this.findBy = findBy;

        return this;
    }

    // TODO: The rest...

    public StoryQuery Build()
    {
        return new StoryQuery
        {
            Token = token,
            CacheVersion = cacheVersion,
            Version = version,
            FindBy = findBy
        };
    }
}
