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

    private readonly RestClient client;

    public StoryblokContentDeliveryApiClient(
        IOptions<StoryblokContentDeliveryApiClientOptions> options)
    {
        var clientOptions = new RestClientOptions(regionBaseUrl[options.Value.Region]);

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        // TODO: Inject StoryBlockTypeRegister into the client via DI and pass it to the converter so it doesn't need to be static?
        jsonOptions.Converters.Add(new StoryBlockJsonConverter());
        jsonOptions.Converters.Add(new StoryblokIntJsonConverter());
        jsonOptions.Converters.Add(new StoryblokNullableIntJsonConverter());

        client = new RestClient(
            clientOptions,
            configureSerialization: s => s.UseSystemTextJson(jsonOptions));

        // TODO: Allow setting token on the request query to override the default token?
        client.AddDefaultQueryParameter("token", options.Value.Token);
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

        // TODO: Allow for request query not to set version, and set it here if not set on query?

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

        RestResponse<StoriesResponse<T>> restResponse = await client.ExecuteGetAsync<StoriesResponse<T>>(
            restRequest,
            cancellationToken);

        // TODO: Handle [Rate limits](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/rate-limit)

        if (restResponse.IsSuccessful)
        {
            return new StoryblokContentDeliveryApiResponse<StoriesResponse<T>>
            {
                Data = restResponse.Data
            };
        }

        var error = new StoryblokContentDeliveryApiError
        {
            StatusCode = restResponse.StatusCode,
            StatusDescription = restResponse.StatusDescription,
            ErrorMessage = restResponse.ErrorMessage,
            Exception = restResponse.ErrorException
        };

        return new StoryblokContentDeliveryApiResponse<StoriesResponse<T>>
        {
            Error = error
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

        // TODO: Allow for request query not to set version, and set it here if not set on query?

        // TODO: Deal with [Cache invalidation](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/cache-invalidation) - continue to allow for setting on the request query, but set here if not set

        RestResponse<StoryResponse<T>> restResponse = await client.ExecuteGetAsync<StoryResponse<T>>(
            restRequest,
            cancellationToken);

        // TODO: Handle [Rate limits](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/rate-limit)

        if (restResponse.IsSuccessful)
        {
            return new StoryblokContentDeliveryApiResponse<StoryResponse<T>>
            {
                Data = restResponse.Data
            };
        }

        var error = new StoryblokContentDeliveryApiError
        {
            StatusCode = restResponse.StatusCode,
            StatusDescription = restResponse.StatusDescription,
            ErrorMessage = restResponse.ErrorMessage,
            Exception = restResponse.ErrorException
        };

        return new StoryblokContentDeliveryApiResponse<StoryResponse<T>>
        {
            Error = error
        };
    }

    public void Dispose()
    {
        client.Dispose();

        GC.SuppressFinalize(this);
    }
}
