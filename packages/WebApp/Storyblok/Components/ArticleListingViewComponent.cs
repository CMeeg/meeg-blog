using System.Globalization;
using Adliance.Storyblok.Clients;
using Microsoft.AspNetCore.Mvc;
using WebApp.Storyblok.Blocks;

namespace WebApp.Storyblok.Components;

public class ArticleListingViewComponent
    : ViewComponent
{
    private readonly StoryblokStoriesClient storyblokStoriesClient;
    private readonly ILogger<ArticleListingViewComponent> logger;

    public ArticleListingViewComponent(
        StoryblokStoriesClient storyblokStoriesClient,
        ILogger<ArticleListingViewComponent> logger)
    {
        this.storyblokStoriesClient = storyblokStoriesClient;
        this.logger = logger;
    }

    public async Task<IViewComponentResult> InvokeAsync(string? startsWith, string? withTag, int perPage)
    {
        var articlesQuery = storyblokStoriesClient.Stories()
            .ForCulture(CultureInfo.CurrentUICulture);

        // TODO: `sort_by` is not supported

        if (perPage > 0)
        {
            // TODO: It feels "weird" to set the per page on the client, but it's the only way
            storyblokStoriesClient.PerPage = perPage;
        }

        if (!string.IsNullOrEmpty(startsWith))
        {
            articlesQuery = articlesQuery.StartingWith(startsWith);
        }

        // TODO: `with_tag` is not supported
        // if (!string.IsNullOrEmpty(withTag))
        // {
        //     articlesQuery = articlesQuery.Having()
        // }

        var articles = (await articlesQuery.Load<ArticleBlock>())
            .Select(story => story.Content)
            .ToArray();

        return View(articles);
    }
}
