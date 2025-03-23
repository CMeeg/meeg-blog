namespace StoryblokDotNet.ContentDelivery;

public sealed class Bit
{
    public static implicit operator Bit(bool value) => new Bit(value);
    public static implicit operator bool(Bit bit) => bit.Value;

    public bool Value { get; }

    public Bit(bool value)
    {
        Value = value;
    }

    public override string ToString() => Value ? "1" : "0";
}
