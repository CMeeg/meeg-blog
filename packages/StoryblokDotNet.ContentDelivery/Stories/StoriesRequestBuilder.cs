namespace StoryblokDotNet.ContentDelivery.Stories;

public sealed class StoriesRequestBuilder
{
    private StoriesQuery query = new StoriesQuery();
    public StoriesRequestBuilder Query(StoriesQuery query)
    {
        this.query = query;

        return this;
    }

    public StoriesRequestBuilder Query(Action<StoriesQueryBuilder> query)
    {
        var queryBuilder = new StoriesQueryBuilder();
        query(queryBuilder);

        this.query = queryBuilder.Build();

        return this;
    }

    public StoriesRequest Build()
    {
        return new StoriesRequest(query);
    }
}
