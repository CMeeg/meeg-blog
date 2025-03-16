using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace StoryblokDotNet.ContentDelivery.Json;

public class StoryblokIntJsonConverter
    : JsonConverter<int>
{
    public override int Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            return reader.GetInt32();
        }

        string? rawValue = reader.GetString();

        if (int.TryParse(rawValue, NumberStyles.Any, CultureInfo.InvariantCulture, out int parsedValue))
        {
            return parsedValue;
        }

        return default;
    }

    public override void Write(
        Utf8JsonWriter writer,
        int value,
        JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
}

public class StoryblokNullableIntJsonConverter
    : JsonConverter<int?>
{
    public override int? Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            return reader.GetInt32();
        }

        string? rawValue = reader.GetString();

        if (int.TryParse(rawValue, NumberStyles.Any, CultureInfo.InvariantCulture, out int parsedValue))
        {
            return parsedValue;
        }

        return null;
    }

    public override void Write(
        Utf8JsonWriter writer,
        int? value,
        JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }
}
