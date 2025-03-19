namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryRequestBuilder
{
    private readonly StoryIdentifier identifier;

    public StoryRequestBuilder(string fullSlug)
    {
        identifier = fullSlug;
    }

    public StoryRequestBuilder(int id)
    {
        identifier = id;
    }

    public StoryRequestBuilder(Guid uuid)
    {
        identifier = uuid;
    }

    private StoryQuery query = new StoryQuery();
    public StoryRequestBuilder Query(StoryQuery query)
    {
        this.query = query;

        return this;
    }

    public StoryRequestBuilder Query(Action<StoryQueryBuilder> query)
    {
        var queryBuilder = new StoryQueryBuilder();
        query(queryBuilder);

        this.query = queryBuilder.Build();

        return this;
    }

    public StoryRequest Build()
    {
        return new StoryRequest(identifier, query);
    }
}
