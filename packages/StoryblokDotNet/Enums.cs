using Ardalis.SmartEnum;

namespace StoryblokDotNet;

public sealed class StoryblokRegion
    : SmartEnum<StoryblokRegion, string>
{
    public static readonly StoryblokRegion EuropeanUnion = new(nameof(EuropeanUnion), "eu");
    public static readonly StoryblokRegion UnitedStates = new(nameof(UnitedStates), "us");
    public static readonly StoryblokRegion Canada = new(nameof(Canada), "ca");
    public static readonly StoryblokRegion Australia = new(nameof(Australia), "ap");
    public static readonly StoryblokRegion China = new(nameof(China), "cn");

    private StoryblokRegion(string name, string value)
        : base(name, value)
    {
    }
}
