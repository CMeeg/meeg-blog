using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery.Stories;

public sealed class StoryBlockField
    : SmartEnum<StoryBlockField, string>
{
    public static readonly StoryBlockField Uid = new(nameof(Uid), StoryBlockFieldName.Uid);
    public static readonly StoryBlockField Component = new(nameof(Component), StoryBlockFieldName.Component);
    public static readonly StoryBlockField Editable = new(nameof(Editable), StoryBlockFieldName.Editable);

    private StoryBlockField(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public static class StoryBlockFieldName
{
    public const string Uid = "_uid";
    public const string Component = "component";
    public const string Editable = "_editable";
}
