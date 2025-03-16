using System.Text.Json.Serialization;

namespace StoryblokDotNet.ContentDelivery;

// TODO: Can implement IDictionary<TKey, TValue> or similar to access non-mapped fields?
public class StoryBlock
{
    [JsonPropertyName(StoryBlockField.Uid)]
    public Guid Uid { get; set; }
    public required string Component { get; set; }
    [JsonPropertyName(StoryBlockField.Editable)]
    public string? Editable { get; set; }
}
