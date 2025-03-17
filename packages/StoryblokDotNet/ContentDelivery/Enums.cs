using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryVersion
    : SmartEnum<StoryVersion, string>
{
    public static readonly StoryVersion Published = new(nameof(Published), "published");
    public static readonly StoryVersion Draft = new(nameof(Draft), "draft");

    private StoryVersion(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public sealed class StoryIdentifierType
    : SmartEnum<StoryIdentifierType, string>
{
    public static readonly StoryIdentifierType FullSlug = new(nameof(FullSlug), StoryField.FullSlug);
    public static readonly StoryIdentifierType Id = new(nameof(Id), StoryField.Id);
    public static readonly StoryIdentifierType Uuid = new(nameof(Uuid), StoryField.Uuid);

    private StoryIdentifierType(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}
