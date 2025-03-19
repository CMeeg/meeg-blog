using System.Text.Json;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Serializers.Json;
using StoryblokDotNet.ContentDelivery.Json;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryblokContentDeliveryApiClient
    : IDisposable
{
    private static readonly Dictionary<StoryblokRegion, string> regionBaseUrl = new()
    {
        { StoryblokRegion.EuropeanUnion, "https://api.storyblok.com/v2/cdn" },
        { StoryblokRegion.UnitedStates, "https://api-us.storyblok.com/v2/cdn" },
        { StoryblokRegion.Canada, "https://api-ca.storyblok.com/v2/cdn" },
        { StoryblokRegion.Australia, "https://api-ap.storyblok.com/v2/cdn" },
        { StoryblokRegion.China, "https://app.storyblokchina.cn" }
    };

    private readonly RestClient client;

    public StoryblokContentDeliveryApiClient(
        IStoryBlockTypeRegistry storyBlockTypeRegistry,
        IOptions<StoryblokContentDeliveryOptions> options)
    {
        var clientOptions = new RestClientOptions(regionBaseUrl[options.Value.Region]);

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        jsonOptions.Converters.Add(new StoryBlockFieldJsonConverter(
            storyBlockTypeRegistry,
            options.Value.ThrowIfBlockTypeNotRegistered));
        jsonOptions.Converters.Add(new StoryIntFieldJsonConverter());
        jsonOptions.Converters.Add(new StoryNullableIntFieldJsonConverter());

        client = new RestClient(
            clientOptions,
            configureSerialization: s => s.UseSystemTextJson(jsonOptions));
    }

    public async Task<StoryblokContentDeliveryApiResponse<T>> ExecuteAsync<T>(
        RestRequest request,
        CancellationToken cancellationToken = default)
    {
        // TODO: Can deserialization be prevented if the response is not successful?
        RestResponse<T> response = await client.ExecuteGetAsync<T>(
            request,
            cancellationToken);

        // TODO: Handle [Rate limits](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/rate-limit)

        if (response.IsSuccessful)
        {
            return new StoryblokContentDeliveryApiResponse<T>
            {
                Data = response.Data,
                ResponseUri = response.ResponseUri
            };
        }

        return new StoryblokContentDeliveryApiResponse<T>
        {
            Error = new StoryblokContentDeliveryApiError
            {
                StatusCode = response.StatusCode,
                StatusDescription = response.StatusDescription,
                ErrorMessage = response.ErrorMessage,
                Exception = response.ErrorException
            },
            ResponseUri = response.ResponseUri
        };
    }

    public void Dispose()
    {
        client.Dispose();

        GC.SuppressFinalize(this);
    }
}
