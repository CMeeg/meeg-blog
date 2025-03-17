namespace StoryblokDotNet.ContentDelivery;

public class StoriesRequest
{
    public StoriesQuery Query { get; private set; }

    public StoriesRequest(StoriesQuery query)
    {
        Query = query;
    }
}
