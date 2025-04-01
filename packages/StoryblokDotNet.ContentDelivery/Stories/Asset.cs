using System.Text.Json.Serialization;

namespace StoryblokDotNet.ContentDelivery.Stories;

public class Asset
{
    public int? Id { get; init; }
    public string? Alt { get; init; }
    [JsonInclude]
    public string Name { get; private set; }
    public string? Focus { get; init; }
    public string? Title { get; init; }
    public string? Source { get; init; }
    [JsonInclude]
    public string Filename { get; private set; }
    public string? Copyright { get; init; }
    [JsonInclude]
    public string Fieldtype { get; private set; }
    public Dictionary<string, object>? MetaData { get; init; }
    public bool? IsExternalUrl { get; init; }

    public Asset(string name, string filename, string fieldtype)
    {
        Name = name;
        Filename = filename;
        Fieldtype = fieldtype;
    }
}
