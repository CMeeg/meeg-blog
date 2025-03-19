using Microsoft.Extensions.Options;
using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryblokStoriesApiClient
{
    private readonly StoryblokContentDeliveryApiClient contentDeliveryApiClient;
    private readonly StoryblokRequestContext storyblokRequestContext;
    private readonly StoryblokContentDeliveryOptions options;

    public StoryblokStoriesApiClient(
        StoryblokContentDeliveryApiClient contentDeliveryApiClient,
        StoryblokRequestContext storyblokRequestContext,
        IOptions<StoryblokContentDeliveryOptions> options)
    {
        this.contentDeliveryApiClient = contentDeliveryApiClient;
        this.storyblokRequestContext = storyblokRequestContext;
        this.options = options.Value;
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<StoryBlock>>> GetStoriesAsync(
        Action<StoriesQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
    {
        return await GetStoriesAsync<StoryBlock>(query, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<T>>> GetStoriesAsync<T>(
        Action<StoriesQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var queryBuilder = new StoriesQueryBuilder();
        query?.Invoke(queryBuilder);

        var request = new StoriesRequest(queryBuilder.Build());

        return await GetStoriesAsync<T>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<StoryBlock>>> GetStoriesAsync(
        StoriesRequest request,
        CancellationToken cancellationToken = default)
    {
        return await GetStoriesAsync<StoryBlock>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<T>>> GetStoriesAsync<T>(
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
            // Default to draft version if in visual editor, else published
            restRequest.AddQueryParameter(StoriesQueryParam.Version, storyblokRequestContext.IsVisualEditorRequest
                ? StoryVersion.Draft.Value
                : StoryVersion.Published.Value);
        }

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

        // TODO: Deal with [Cache invalidation](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/cache-invalidation) - continue to allow for setting on the request query, but set here if not set

        return await contentDeliveryApiClient.ExecuteAsync<StoriesResponse<T>>(
            restRequest,
            cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> GetStoryAsync<T>(
        string fullSlug,
        Action<StoryQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var queryBuilder = new StoryQueryBuilder();
        query?.Invoke(queryBuilder);

        var request = new StoryRequest(fullSlug, queryBuilder.Build());

        return await GetStoryAsync<T>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> GetStoryAsync<T>(
        int id,
        Action<StoryQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var queryBuilder = new StoryQueryBuilder();
        query?.Invoke(queryBuilder);

        var request = new StoryRequest(id, queryBuilder.Build());

        return await GetStoryAsync<T>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> GetStoryAsync<T>(
        Guid uuid,
        Action<StoryQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var queryBuilder = new StoryQueryBuilder();
        query?.Invoke(queryBuilder);

        var request = new StoryRequest(uuid, queryBuilder.Build());

        return await GetStoryAsync<T>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> GetStoryAsync<T>(
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
            // Default to draft version if in visual editor, else published
            restRequest.AddQueryParameter(StoriesQueryParam.Version, storyblokRequestContext.IsVisualEditorRequest
                ? StoryVersion.Draft.Value
                : StoryVersion.Published.Value);
        }

        // TODO: Deal with [Cache invalidation](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/cache-invalidation) - continue to allow for setting on the request query, but set here if not set

        return await contentDeliveryApiClient.ExecuteAsync<StoryResponse<T>>(
            restRequest,
            cancellationToken);
    }
}
