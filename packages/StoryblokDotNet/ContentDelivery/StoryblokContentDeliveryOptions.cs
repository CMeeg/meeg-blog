using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryblokContentDeliveryOptions
{
	public const string SectionName = "Storyblok__ContentDelivery";

    public string Token { get; set; } = "";
    public StoryblokRegion Region { get; set; } = StoryblokRegion.EuropeanUnion;
    public CacheVersionOptions CacheVersion { get; set; } = new ();
    public bool ThrowIfBlockTypeNotRegistered { get; set; } = true;
    public Func<IServiceProvider, IStoryBlockTypeRegistry>? StoryBlockTypeRegistryFactory { get; set; }

    public sealed class CacheVersionOptions
    {
        public CacheVersionMode Mode { get; set; } = CacheVersionMode.Automatic;
        public int CacheForMins { get; set; } = 60;
    }

    public sealed class CacheVersionMode
        : SmartEnum<CacheVersionMode, string>
    {
        public static readonly CacheVersionMode Automatic = new (nameof(Automatic), "automatic");
        public static readonly CacheVersionMode Manual = new (nameof(Manual), "manual");

        private CacheVersionMode(string name, string value)
            : base(name, value)
        {
        }

        public override string ToString() => Value;
    }
}
