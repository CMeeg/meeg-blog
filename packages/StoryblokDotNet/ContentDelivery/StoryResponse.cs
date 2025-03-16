namespace StoryblokDotNet.ContentDelivery;

public class StoryResponse<T>
    where T : StoryBlock
{
    public required Story<T> Story { get; set; }
    public int CV { get; set; }
    // TODO: rels
    // TODO: links
    public Guid[]? RelUuids { get; set; }
    public Guid[]? LinkUuids { get; set; }
}

