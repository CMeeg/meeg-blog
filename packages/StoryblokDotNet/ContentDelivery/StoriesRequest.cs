namespace StoryblokDotNet.ContentDelivery;

public class StoriesRequest
{
    public StoriesQuery Query { get; private set; }

    public StoriesRequest(StoriesQuery query)
    {
        Query = query;

        // TODO: If the Story Content is strongly typed, set a FilterQuery to the block type name?
    }
}
