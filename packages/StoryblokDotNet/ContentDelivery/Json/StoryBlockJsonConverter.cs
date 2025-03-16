using System.Text.Json;
using System.Text.Json.Serialization;

namespace StoryblokDotNet.ContentDelivery.Json;

public class StoryBlockJsonConverter
    : JsonConverter<StoryBlock>
{
    public override StoryBlock Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        // TODO: Look into if there are better ways to do this
        // performance is probably abysmal, but System.Text.Json does not support polymorphic deserialization very well
        // https://github.com/dotnet/corefx/issues/38650

        using var doc = JsonDocument.ParseValue(ref reader);

        if (doc.RootElement.TryGetProperty(StoryBlockField.Component, out JsonElement blockElement))
        {
            string? blockName = blockElement.GetString();

            if (!string.IsNullOrWhiteSpace(blockName))
            {
                IDictionary<string, StoryBlockType> blockTypes = StoryBlockTypeRegister.Types;

                if (blockTypes.TryGetValue(blockName, out StoryBlockType? blockType))
                {
                    string rawText = doc.RootElement.GetRawText();

                    try
                    {
                        if (!(JsonSerializer.Deserialize(rawText, blockType.Type, options) is StoryBlock block))
                        {
                            throw new JsonException("Failed to deserialize json to type StoryBlock.");
                        }

                        // TODO: Do this or remove it?
                        // we don't want the "editable" property set at all, when we're not in editor
                        // this makes it easier for the client, so he does not have to check if in the editor on each component, he just has to render the "editable" stuff into it
                        // if (!StoryblokBaseClient.IsInEditor)
                        // {
                        //     component.Editable = null;
                        // }

                        // component.IsInEditor = StoryblokBaseClient.IsInEditor;

                        return block;
                    }
                    catch (JsonException ex)
                    {
                        throw new JsonException($"Unable to deserialize ({ex.Message}): {rawText}", ex);
                    }
                }
            }
        }

        // Don't call JsonSerializer.Deserialize, because we'll get a stack overflow
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
