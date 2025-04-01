namespace StoryblokDotNet.ContentDelivery.Stories;

public sealed class StoryResponse<T>
    where T : StoryBlock
{
    public Story<T> Story { get; private set; }
    public long CV { get; private set; }
    // TODO: rels
    // TODO: links
    public Guid[]? RelUuids { get; init; }
    public Guid[]? LinkUuids { get; init; }

    public StoryResponse(Story<T> story, long cv)
    {
        Story = story;
        CV = cv;
    }
}

