namespace StoryblokDotNet.ContentDelivery.Stories;

public sealed class StoryBlockType
{
    public string Name { get; set; } = "";
    public Type Type { get; set; } = typeof(object);
    public string? View { get; set; }
}

[AttributeUsage(AttributeTargets.Class)]
public sealed class StoryBlockTypeAttribute(string name, string? view = null)
    : Attribute
{
    public string Name { get; } = name;
    public string? View { get; set; } = view;
}
