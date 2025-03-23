using System.Text.Json.Serialization;

namespace StoryblokDotNet.ContentDelivery.Stories;

// TODO: Can implement IDictionary<TKey, TValue> or similar to access non-mapped fields?
public class StoryBlock
{
    [JsonPropertyName(StoryBlockFieldName.Uid)]
    public Guid Uid { get; set; }
    public required string Component { get; set; }
    [JsonPropertyName(StoryBlockFieldName.Editable)]
    public string? Editable { get; set; }
}
