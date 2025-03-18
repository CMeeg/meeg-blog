using Microsoft.AspNetCore.Mvc;
using StoryblokDotNet.ContentDelivery;
using WebApp.Storyblok.Blocks;

namespace WebApp.Storyblok.Components;

public class ArticleListingViewComponent
    : ViewComponent
{
    private readonly StoryblokContentDeliveryApiClient storyblokApiClient;
    private readonly ILogger<ArticleListingViewComponent> logger;

    public ArticleListingViewComponent(
        StoryblokContentDeliveryApiClient storyblokApiClient,
        ILogger<ArticleListingViewComponent> logger)
    {
        this.storyblokApiClient = storyblokApiClient;
        this.logger = logger;
    }

    public async Task<IViewComponentResult> InvokeAsync(string? startsWith, string? withTag, int perPage)
    {
        var response = await storyblokApiClient.StoriesAsync<ArticleBlock>(query =>
        {
            query.IsStartpage(false)
                .SortBy(SortExpression.By(StoryField.FirstPublishedAt).Desc())
                .ContentType(ArticleBlock.TechnicalName)
                .PerPage(perPage);

            if (!string.IsNullOrEmpty(startsWith))
            {
                query.StartsWith(startsWith);
            }

            if (!string.IsNullOrEmpty(withTag))
            {
                query.Tags(withTag);
            }
        });

        if (response.Data == null)
        {
            logger.LogError(
                response.Error?.Exception,
                "Request to fetch articles failed with status code {StatusCode}. Error: {ErrorMessage}",
                response.Error?.StatusCode,
                response.Error?.ErrorMessage ?? response.Error?.StatusDescription ?? "Unknown.");

            return Content("Failed to load articles.");
        }

        return View(response.Data.Stories);
    }
}
