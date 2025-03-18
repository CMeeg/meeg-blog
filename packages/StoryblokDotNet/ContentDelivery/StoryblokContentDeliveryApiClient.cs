using System.Text.Json;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Serializers.Json;
using StoryblokDotNet.ContentDelivery.Json;

namespace StoryblokDotNet.ContentDelivery;

public class StoryblokContentDeliveryApiClient
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

    private readonly StoryblokContentDeliveryApiClientOptions options;
    private readonly RestClient client;

    public StoryblokContentDeliveryApiClient(
        IStoryBlockTypeRegistry storyBlockTypeRegistry,
        IOptions<StoryblokContentDeliveryApiClientOptions> options)
    {
        this.options = options.Value;

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

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<StoryBlock>>> StoriesAsync(
        Action<StoriesRequestBuilder>? request = null,
        CancellationToken cancellationToken = default)
    {
        return await StoriesAsync<StoryBlock>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<T>>> StoriesAsync<T>(
        Action<StoriesRequestBuilder>? request = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var requestBuilder = new StoriesRequestBuilder();
        request?.Invoke(requestBuilder);

        StoriesRequest storiesRequest = requestBuilder.Build();

        return await StoriesAsync<T>(storiesRequest, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<StoryBlock>>> StoriesAsync(
        StoriesRequest request,
        CancellationToken cancellationToken = default)
    {
        return await StoriesAsync<StoryBlock>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<T>>> StoriesAsync<T>(
        StoriesRequest request,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var restRequest = new RestRequest("stories", Method.Get);

        if (request.Query.Token == null)
        {
            // Use the default token if not set on the request
            restRequest.AddQueryParameter(StoriesQueryParam.Token, options.Token);
        }

        if (request.Query.Version == null)
        {
            // TODO: Inject some request context to default to draft version if in Visual Editor mode?
            // Default to published version if not set on the request
            restRequest.AddQueryParameter(StoriesQueryParam.Version, StoryVersion.Published.Value);
        }

        // TODO: Deal with [Cache invalidation](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/cache-invalidation) - continue to allow for setting on the request query, but set here if not set

        // The format of the `filter_query` parameter is "special" (i.e. not a standard key=value query parameter) so it needs "special" handling
        string? filterQuery = request.Query.FilterQuery;

        try
        {
            if (filterQuery != null)
            {
                // Add the filter query to the request
                restRequest.AddQueryParameter(filterQuery, null, false);

                // Clear the filter query to avoid adding it again
                request.Query.FilterQuery = null;
            }

            restRequest.AddObject(request.Query);
        }
        finally
        {
            // Ensure that the filter query is restored even if an exception is thrown
            request.Query.FilterQuery = filterQuery;
        }

        // TODO: Can deserialization be prevented if the response is not successful?
        RestResponse<StoriesResponse<T>> restResponse = await client.ExecuteGetAsync<StoriesResponse<T>>(
            restRequest,
            cancellationToken);

        // TODO: Handle [Rate limits](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/rate-limit)

        if (restResponse.IsSuccessful)
        {
            return new StoryblokContentDeliveryApiResponse<StoriesResponse<T>>
            {
                Data = restResponse.Data,
                ResponseUri = restResponse.ResponseUri
            };
        }

        return new StoryblokContentDeliveryApiResponse<StoriesResponse<T>>
        {
            Error = new StoryblokContentDeliveryApiError
            {
                StatusCode = restResponse.StatusCode,
                StatusDescription = restResponse.StatusDescription,
                ErrorMessage = restResponse.ErrorMessage,
                Exception = restResponse.ErrorException
            },
            ResponseUri = restResponse.ResponseUri
        };
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> StoryAsync<T>(
        string fullSlug,
        Action<StoryRequestBuilder>? request = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var requestBuilder = new StoryRequestBuilder(fullSlug);
        request?.Invoke(requestBuilder);

        StoryRequest storyRequest = requestBuilder.Build();

        return await StoryAsync<T>(storyRequest, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> StoryAsync<T>(
        int id,
        Action<StoryRequestBuilder>? request = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var requestBuilder = new StoryRequestBuilder(id);
        request?.Invoke(requestBuilder);

        StoryRequest storyRequest = requestBuilder.Build();

        return await StoryAsync<T>(storyRequest, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> StoryAsync<T>(
        Guid uuid,
        Action<StoryRequestBuilder>? request = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var requestBuilder = new StoryRequestBuilder(uuid);
        request?.Invoke(requestBuilder);

        StoryRequest storyRequest = requestBuilder.Build();

        return await StoryAsync<T>(storyRequest, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> StoryAsync<T>(
        StoryRequest request,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var restRequest = new RestRequest("stories/{identifier}", Method.Get)
            .AddUrlSegment("identifier", request.Identifier.ToString());

        if (request.Query.Token == null)
        {
            // Use the default token if not set on the request
            restRequest.AddQueryParameter(StoryQueryParam.Token, options.Token);
        }

        if (request.Query.Version == null)
        {
            // TODO: Inject some request context to default to draft version if in Visual Editor mode?
            // Default to published version if not set on the request
            restRequest.AddQueryParameter(StoryQueryParam.Version, StoryVersion.Published.Value);
        }

        // TODO: Deal with [Cache invalidation](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/cache-invalidation) - continue to allow for setting on the request query, but set here if not set

        // TODO: Can deserialization be prevented if the response is not successful?
        RestResponse<StoryResponse<T>> restResponse = await client.ExecuteGetAsync<StoryResponse<T>>(
            restRequest,
            cancellationToken);

        // TODO: Handle [Rate limits](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/rate-limit)

        if (restResponse.IsSuccessful)
        {
            return new StoryblokContentDeliveryApiResponse<StoryResponse<T>>
            {
                Data = restResponse.Data,
                ResponseUri = restResponse.ResponseUri
            };
        }

        return new StoryblokContentDeliveryApiResponse<StoryResponse<T>>
        {
            Error = new StoryblokContentDeliveryApiError
            {
                StatusCode = restResponse.StatusCode,
                StatusDescription = restResponse.StatusDescription,
                ErrorMessage = restResponse.ErrorMessage,
                Exception = restResponse.ErrorException
            },
            ResponseUri = restResponse.ResponseUri
        };
    }

    public void Dispose()
    {
        client.Dispose();

        GC.SuppressFinalize(this);
    }
}
