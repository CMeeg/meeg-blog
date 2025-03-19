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

    private ResolveLinksType? resolveLinks;
    public StoryQueryBuilder ResolveLinks(ResolveLinksType? resolveLinks)
    {
        this.resolveLinks = resolveLinks;

        return this;
    }

    private int? resolveLinksLevel;
    public StoryQueryBuilder ResolveLinksLevel(int? resolveLinksLevel)
    {
        this.resolveLinksLevel = resolveLinksLevel;

        return this;
    }

    private string[]? resolveRelations;
    public StoryQueryBuilder ResolveRelations(params string[]? relations)
    {
        resolveRelations = relations;

        return this;
    }

    private string? fromRelease;
    public StoryQueryBuilder FromRelease(string? release)
    {
        fromRelease = release;

        return this;
    }

    private string? fallbackLang;
    public StoryQueryBuilder FallbackLang(string? fallbackLang)
    {
        this.fallbackLang = fallbackLang;

        return this;
    }

    private string? language;
    public StoryQueryBuilder Language(string? language)
    {
        this.language = language;

        return this;
    }

    private Bit? resolveAssets;
    public StoryQueryBuilder ResolveAssets(bool? resolveAssets)
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
    public StoryQueryBuilder ResolveLevel(bool? resolveLevel)
    {
        if (resolveLevel == null)
        {
            this.resolveLevel = null;

            return this;
        }

        this.resolveLevel = resolveLevel.Value;

        return this;
    }

    public StoryQuery Build()
    {
        return new StoryQuery
        {
            Token = token,
            CacheVersion = cacheVersion,
            Version = version,
            FindBy = findBy,
            ResolveLinks = resolveLinks,
            ResolveLinksLevel = resolveLinksLevel,
            ResolveRelations = resolveRelations,
            FromRelease = fromRelease,
            FallbackLang = fallbackLang,
            Language = language,
            ResolveAssets = resolveAssets,
            ResolveLevel = resolveLevel
        };
    }
}
