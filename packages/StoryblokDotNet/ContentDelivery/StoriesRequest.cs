namespace StoryblokDotNet.ContentDelivery;

public sealed class StoriesRequest
{
    public StoriesQuery Query { get; private set; }

    public StoriesRequest(StoriesQuery query)
    {
        Query = query;
    }
}
