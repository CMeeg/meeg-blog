using System.Text.Json;
using System.Text.Json.Serialization;

namespace StoryblokDotNet.ContentDelivery.Json;

internal sealed class StoryBlockFieldJsonConverter
    : JsonConverter<StoryBlock>
{
    private readonly IStoryBlockTypeRegistry storyBlockTypeRegistry;
    private readonly bool throwIfBlockTypeNotRegistered;

    public StoryBlockFieldJsonConverter(
        IStoryBlockTypeRegistry storyBlockTypeRegistry,
        bool throwIfBlockTypeNotRegistered = true)
    {
        this.storyBlockTypeRegistry = storyBlockTypeRegistry;
        this.throwIfBlockTypeNotRegistered = throwIfBlockTypeNotRegistered;
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

        if (!doc.RootElement.TryGetProperty(StoryBlockField.Component, out JsonElement blockElement))
        {
            throw new JsonException($"Missing required property '{StoryBlockField.Component}'.");
        }

        string? blockName = blockElement.GetString();

        if (string.IsNullOrWhiteSpace(blockName))
        {
            throw new JsonException($"Property '{StoryBlockField.Component}' must not be empty.");
        }

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

        if (throwIfBlockTypeNotRegistered)
        {
            throw new JsonException($"Block type '{blockName}' is not registered.");
        }

        // Don't call JsonSerializer.Deserialize, because it will recurse and we'll get a stack overflow

        if (!doc.RootElement.TryGetProperty(StoryBlockField.Uid, out JsonElement uidElement))
        {
            throw new JsonException($"Missing required property '{StoryBlockField.Uid}'.");
        }

        doc.RootElement.TryGetProperty(StoryBlockField.Editable, out JsonElement editableElement);

        return new StoryBlock
        {
            Uid = uidElement.GetGuid(),
            Component = blockName,
            Editable = editableElement.ValueKind == JsonValueKind.Undefined
                ? null
                : editableElement.GetString()
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
