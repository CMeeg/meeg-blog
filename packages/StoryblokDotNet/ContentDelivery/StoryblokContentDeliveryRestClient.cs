using System.Text.Json;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Serializers.Json;
using StoryblokDotNet.ContentDelivery.Json;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryblokContentDeliveryRestClient
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

    public StoryblokContentDeliveryRestClient(
        IStoryBlockTypeRegistry storyBlockTypeRegistry,
        IOptions<StoryblokContentDeliveryOptions> options)
    {
        var clientOptions = new RestClientOptions(regionBaseUrl[options.Value.Region])
        {
            FailOnDeserializationError = true
        };

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
        RestResponse response = await client.ExecuteAsync(
            request,
            cancellationToken);

        // TODO: Handle [Rate limits](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/rate-limit) maybe with [Polly](https://www.pollydocs.org/strategies/retry.html)

        if (response.IsSuccessful)
        {
            try
            {
                return new StoryblokContentDeliveryApiResponse<T>
                {
                    Data = client.Serializers.DeserializeContent<T>(response),
                    ResponseUri = response.ResponseUri
                };
            }
            catch (JsonException ex)
            {
                return CreateErrorResponse<T>(response, ex);
            }
        }

        // Storyblok doesn't return a consistent response body for errors so we can't reliably deserialize it
        // Docs say to just use the status code
        // https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/errors

        return CreateErrorResponse<T>(response);
    }

    private static StoryblokContentDeliveryApiResponse<T> CreateErrorResponse<T>(
        RestResponse response,
        Exception? ex = null)
    {
        return new StoryblokContentDeliveryApiResponse<T>
        {
            Error = new StoryblokContentDeliveryApiError
            {
                StatusCode = response.StatusCode,
                StatusDescription = response.StatusDescription,
                ErrorMessage = ex?.Message ?? response.ErrorMessage,
                Exception = ex ?? response.ErrorException
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
