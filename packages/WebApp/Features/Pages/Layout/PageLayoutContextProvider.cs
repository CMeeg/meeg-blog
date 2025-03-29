using Microsoft.AspNetCore.Http.Extensions;

namespace WebApp.Features.Pages.Layout;

public interface IPageLayoutContextProvider
{
    Task<PageHead> CreatePageHeadAsync();
}

public class DefaultPageLayoutContextProvider
    : IPageLayoutContextProvider
{
    private readonly IHttpContextAccessor httpContextAccessor;

    public DefaultPageLayoutContextProvider(IHttpContextAccessor httpContextAccessor)
    {
        this.httpContextAccessor = httpContextAccessor;
    }

    public virtual Task<PageHead> CreatePageHeadAsync()
    {
        HttpRequest? request = httpContextAccessor.HttpContext?.Request;

        string? canonicalUrl = request == null
            ? null
            : UriHelper.BuildAbsolute(
                request.Scheme,
                request.Host,
                request.PathBase,
                request.Path);

        return Task.FromResult(new PageHead
        {
            Metadata = new PageMetadata
            {
                CanonicalUrl = canonicalUrl
            }
        });
    }
}
