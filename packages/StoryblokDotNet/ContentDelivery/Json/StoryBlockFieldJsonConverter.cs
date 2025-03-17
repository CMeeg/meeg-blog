using System.Text.Json;
using System.Text.Json.Serialization;

namespace StoryblokDotNet.ContentDelivery.Json;

public class StoryBlockFieldJsonConverter
    : JsonConverter<StoryBlock>
{
    private readonly IStoryBlockTypeRegistry storyBlockTypeRegistry;

    public StoryBlockFieldJsonConverter(IStoryBlockTypeRegistry storyBlockTypeRegistry)
    {
        this.storyBlockTypeRegistry = storyBlockTypeRegistry;
    }

    public override StoryBlock Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        // TODO: Look into if there are better ways to do this
        // System.Text.Json does not support polymorphic deserialization very well
        // https://github.com/dotnet/corefx/issues/38650

        using var doc = JsonDocument.ParseValue(ref reader);

        if (doc.RootElement.TryGetProperty(StoryBlockField.Component, out JsonElement blockElement))
        {
            string? blockName = blockElement.GetString();

            if (!string.IsNullOrWhiteSpace(blockName))
            {
                if (storyBlockTypeRegistry.TryGetBlockType(blockName, out StoryBlockType? blockType))
                {
                    string rawText = doc.RootElement.GetRawText();

                    try
                    {
                        if (!(JsonSerializer.Deserialize(rawText, blockType.Type, options) is StoryBlock block))
                        {
                            throw new JsonException($"Type '{blockType.Type.FullName}' registered for block type '{blockName}' must derive from {typeof(StoryBlock).FullName}.");
                        }

                        return block;
                    }
                    catch (JsonException ex)
                    {
                        throw new JsonException($"Unable to deserialize ({ex.Message}): {rawText}", ex);
                    }
                }
            }
        }

        // TODO: Add an option to throw an exception if the block type is not registered
        // Don't call JsonSerializer.Deserialize, because it will recurse and we'll get a stack overflow
        return new StoryBlock
        {
            Uid = doc.RootElement.GetProperty(StoryBlockField.Uid).GetGuid(),
            Component = doc.RootElement.GetProperty(StoryBlockField.Component).GetString() ?? "",
            Editable = doc.RootElement.GetProperty(StoryBlockField.Editable).GetString()
        };
    }

    public override void Write(
        Utf8JsonWriter writer,
        StoryBlock value,
        JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
}
