using System.Text.Json;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Serializers.Json;
using StoryblokDotNet.ContentDelivery.Json;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryblokContentDeliveryApiClient
{
    private readonly StoryblokStoriesApiClient storiesApiClient;

    public StoryblokStoriesApiClient Stories => storiesApiClient;

    public StoryblokContentDeliveryApiClient(
        StoryblokStoriesApiClient storiesApiClient)
    {
        this.storiesApiClient = storiesApiClient;
    }
}
