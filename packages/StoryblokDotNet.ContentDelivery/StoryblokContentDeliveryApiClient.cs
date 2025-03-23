using StoryblokDotNet.ContentDelivery.Spaces;
using StoryblokDotNet.ContentDelivery.Stories;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryblokContentDeliveryApiClient
{
    private readonly StoryblokStoriesApiClient storiesApiClient;
    private readonly StoryblokSpacesApiClient spacesApiClient;

    public StoryblokStoriesApiClient Stories => storiesApiClient;
    public StoryblokSpacesApiClient Spaces => spacesApiClient;

    public StoryblokContentDeliveryApiClient(
        StoryblokStoriesApiClient storiesApiClient,
        StoryblokSpacesApiClient spacesApiClient)
    {
        this.storiesApiClient = storiesApiClient;
        this.spacesApiClient = spacesApiClient;
    }
}
