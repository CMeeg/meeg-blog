using System.Net;

namespace StoryblokDotNet.ContentDelivery;

public class StoryblokContentDeliveryApiResponse<T>
{
    public T? Data { get; init; }
    public StoryblokContentDeliveryApiError? Error { get; init; }
    public Uri? ResponseUri { get; init; }
}

public class StoryblokContentDeliveryApiError
{
    public HttpStatusCode StatusCode { get; init; }
    public string? StatusDescription { get; init; }
    public string? ErrorMessage { get; init; }
    public Exception? Exception { get; init; }
}
