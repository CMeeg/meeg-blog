using System.Net;

namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryblokContentDeliveryApiResponse<T>
{
    public T? Data { get; init; }
    public StoryblokContentDeliveryApiError? Error { get; init; }
    public Uri? ResponseUri { get; init; }
}

public sealed class StoryblokContentDeliveryApiError
{
    public HttpStatusCode StatusCode { get; init; }
    public string? StatusDescription { get; init; }
    public string? ErrorMessage { get; init; }
    public Exception? Exception { get; init; }
}
