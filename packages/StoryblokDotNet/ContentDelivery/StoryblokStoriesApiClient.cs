using RestSharp;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryblokStoriesApiClient
{
    private readonly StoryblokContentDeliveryRestClient contentDeliveryRestClient;
    private readonly StoryblokRequestContext storyblokRequestContext;

    public StoryblokStoriesApiClient(
        StoryblokContentDeliveryRestClient contentDeliveryRestClient,
        StoryblokRequestContext storyblokRequestContext)
    {
        this.contentDeliveryRestClient = contentDeliveryRestClient;
        this.storyblokRequestContext = storyblokRequestContext;
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<StoryBlock>>> GetMultipleAsync(
        Action<StoriesQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
    {
        return await GetMultipleAsync<StoryBlock>(query, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<T>>> GetMultipleAsync<T>(
        Action<StoriesQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var queryBuilder = new StoriesQueryBuilder();
        query?.Invoke(queryBuilder);

        var request = new StoriesRequest(queryBuilder.Build());

        return await GetMultipleAsync<T>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<StoryBlock>>> GetMultipleAsync(
        StoriesRequest request,
        CancellationToken cancellationToken = default)
    {
        return await GetMultipleAsync<StoryBlock>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoriesResponse<T>>> GetMultipleAsync<T>(
        StoriesRequest request,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var restRequest = new RestRequest("stories", Method.Get);

        if(!request.Query.CacheVersion.HasValue)
        {
            // Default to the current cache version if not set
            request.Query.CacheVersion = await storyblokRequestContext.GetCacheVersion(cancellationToken);
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

        return await contentDeliveryRestClient.ExecuteAsync<StoriesResponse<T>>(
            restRequest,
            cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> GetSingleAsync<T>(
        string fullSlug,
        Action<StoryQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var queryBuilder = new StoryQueryBuilder();
        query?.Invoke(queryBuilder);

        var request = new StoryRequest(fullSlug, queryBuilder.Build());

        return await GetSingleAsync<T>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> GetSingleAsync<T>(
        int id,
        Action<StoryQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var queryBuilder = new StoryQueryBuilder();
        query?.Invoke(queryBuilder);

        var request = new StoryRequest(id, queryBuilder.Build());

        return await GetSingleAsync<T>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> GetSingleAsync<T>(
        Guid uuid,
        Action<StoryQueryBuilder>? query = null,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var queryBuilder = new StoryQueryBuilder();
        query?.Invoke(queryBuilder);

        var request = new StoryRequest(uuid, queryBuilder.Build());

        return await GetSingleAsync<T>(request, cancellationToken);
    }

    public async Task<StoryblokContentDeliveryApiResponse<StoryResponse<T>>> GetSingleAsync<T>(
        StoryRequest request,
        CancellationToken cancellationToken = default)
        where T : StoryBlock
    {
        var restRequest = new RestRequest("stories/{identifier}", Method.Get)
            .AddUrlSegment("identifier", request.Identifier.ToString());

        if(!request.Query.CacheVersion.HasValue)
        {
            // Default to the current cache version if not set
            request.Query.CacheVersion = await storyblokRequestContext.GetCacheVersion(cancellationToken);
        }

        if (request.Query.Version == null)
        {
            // Default to draft version if in visual editor, else published
            restRequest.AddQueryParameter(StoriesQueryParam.Version, storyblokRequestContext.IsVisualEditorRequest
                ? StoryVersion.Draft.Value
                : StoryVersion.Published.Value);
        }

        return await contentDeliveryRestClient.ExecuteAsync<StoryResponse<T>>(
            restRequest,
            cancellationToken);
    }
}
