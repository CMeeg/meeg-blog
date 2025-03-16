namespace StoryblokDotNet.ContentDelivery;

public class StoryIdentifier
{
    public static implicit operator StoryIdentifier(string value) => new StoryIdentifier(value);
    public static implicit operator StoryIdentifier(int value) => new StoryIdentifier(value);
    public static implicit operator StoryIdentifier(Guid value) => new StoryIdentifier(value);

    public object Value { get; }

    public StoryIdentifierType IdentifierType => Value switch
    {
        string _ => StoryIdentifierType.FullSlug,
        int _ => StoryIdentifierType.Id,
        Guid _ => StoryIdentifierType.Uuid,
        _ => throw new InvalidOperationException("Value is not a valid StoryIdentifierType.")
    };

    public StoryIdentifier(string value)
    {
        Value = value;
    }

    public StoryIdentifier(int value)
    {
        Value = value;
    }

    public StoryIdentifier(Guid value)
    {
        Value = value;
    }

    public override string ToString()
    {
        string? value = Value.ToString();

        if (value is null)
        {
            throw new InvalidOperationException("Value.ToString() returned null.");
        }

        return value;
    }
}
