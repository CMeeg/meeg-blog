using Microsoft.Extensions.Options;
using RestSharp;

namespace StoryblokDotNet.ContentDelivery.Spaces;

public sealed class StoryblokSpacesApiClient
{
    private readonly StoryblokContentDeliveryRestClient contentDeliveryRestClient;

    public StoryblokSpacesApiClient(
        StoryblokContentDeliveryRestClient contentDeliveryRestClient)
    {
        this.contentDeliveryRestClient = contentDeliveryRestClient;
    }

    public async Task<StoryblokContentDeliveryApiResponse<SpaceResponse>> GetCurrentSpaceAsync(
        CancellationToken cancellationToken = default)
    {
        var restRequest = new RestRequest("spaces/me", Method.Get);

        return await contentDeliveryRestClient.ExecuteAsync<SpaceResponse>(
            restRequest,
            cancellationToken);
    }
}
