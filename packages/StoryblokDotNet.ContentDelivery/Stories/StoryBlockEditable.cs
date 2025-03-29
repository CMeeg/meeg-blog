using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace StoryblokDotNet.ContentDelivery.Stories;

public sealed partial class StoryBlockEditable
{
    [GeneratedRegex(@"<!--#storyblok#(.*?)-->")]
    private static partial Regex EditableRegex();

    [JsonPropertyName("name")]
    public required string Name { get; init; }
    [JsonPropertyName("space")]
    public required string Space { get; init; }
    [JsonPropertyName("uid")]
    public required Guid Uid { get; init; }
    [JsonPropertyName("id")]
    public required string Id { get; init; }
    [JsonIgnore]
    public string EditorUid => $"{Id}-{Uid}";

    public string ToJson()
    {
        return JsonSerializer.Serialize(this);
    }

    public static bool TryParse(string? editable, [NotNullWhen(true)] out StoryBlockEditable? result)
    {
        try
        {
            result = Deserialize(editable);
            return result != null;
        }
        catch (JsonException)
        {
            result = null;
            return false;
        }
    }

    public static StoryBlockEditable? Deserialize(string? editable)
    {
        if (string.IsNullOrEmpty(editable))
        {
            return null;
        }

        // Extract JSON from the HTML comment using regex
        Match match = EditableRegex().Match(editable);
        if (!match.Success || match.Groups.Count < 2)
        {
            return null;
        }

        string jsonString = match.Groups[1].Value;

        try
        {
            // Parse the JSON string to an StoryBlockEditable object
            return JsonSerializer.Deserialize<StoryBlockEditable>(jsonString);
        }
        catch (JsonException)
        {
            throw;
        }
    }
}
