namespace StoryblokDotNet.ContentDelivery;

public class StoryblokContentDeliveryApiClientOptions
{
    public required string Token { get; set; }
    public StoryblokRegion Region { get; set; } = StoryblokRegion.EuropeanUnion;
}
