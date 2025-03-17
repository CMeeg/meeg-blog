namespace StoryblokDotNet.ContentDelivery;

public class StoryQueryBuilder
{
    private StoryVersion version = StoryVersion.Published;
    public StoryQueryBuilder Version(StoryVersion version)
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
            Version = version,
            FindBy = findBy
        };
    }
}
