using System.Text.Json;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Serializers.Json;
using StoryblokDotNet.ContentDelivery.Json;
using StoryblokDotNet.ContentDelivery.Spaces;

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
