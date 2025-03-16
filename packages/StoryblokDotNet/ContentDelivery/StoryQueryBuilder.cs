namespace StoryblokDotNet.ContentDelivery;

public class StoryQueryBuilder
{
    private StoryVersion version = StoryVersion.Published;
    public StoryQueryBuilder Version(StoryVersion version)
    {
        this.version = version;

        return this;
    }

    private StoryFindBy? findBy;
    public StoryQueryBuilder FindBy(StoryFindBy? findBy)
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
