namespace StoryblokDotNet.ContentDelivery.Stories;

public sealed class StoriesResponse<T>
    where T : StoryBlock
{
    public Story<T>[] Stories { get; private set; }
    public long CV { get; private set; }
    // TODO: rels
    // TODO: links
    public Guid[]? RelUuids { get; init; }
    public Guid[]? LinkUuids { get; init; }

    public StoriesResponse(Story<T>[] stories, long cv)
    {
        Stories = stories;
        CV = cv;
    }
}

