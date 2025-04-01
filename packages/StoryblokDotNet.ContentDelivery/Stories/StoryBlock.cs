using System.Text.Json.Serialization;

namespace StoryblokDotNet.ContentDelivery.Stories;

// TODO: Can implement IDictionary<TKey, TValue> or similar to access non-mapped fields?
public class StoryBlock
{
    [JsonPropertyName(StoryBlockFieldName.Uid)]
    public Guid Uid { get; private set; }
    public string Component { get; private set; }
    [JsonPropertyName(StoryBlockFieldName.Editable)]
    public string? Editable { get; init; }

    public StoryBlock(Guid uid, string component)
    {
        Uid = uid;
        Component = component;
    }
}
