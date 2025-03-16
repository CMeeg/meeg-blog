namespace StoryblokDotNet.ContentDelivery;

public class StoryblokContentDeliveryOptions
{
	public const string SectionName = "Storyblok__ContentDelivery";

    public string? Token { get; set; }
    public StoryblokRegion Region { get; set; } = StoryblokRegion.EuropeanUnion;
}
