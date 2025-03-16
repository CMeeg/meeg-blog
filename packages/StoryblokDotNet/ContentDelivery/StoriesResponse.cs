namespace StoryblokDotNet.ContentDelivery;

public class StoriesResponse<T>
    where T : StoryBlock
{
    public required Story<T>[] Stories { get; set; }
    public int CV { get; set; }
    // TODO: rels
    // TODO: links
    public Guid[]? RelUuids { get; set; }
    public Guid[]? LinkUuids { get; set; }
}

