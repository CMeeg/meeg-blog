using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using StoryblokDotNet.ContentDelivery;
using WebApp.Storyblok.Blocks;

namespace WebApp.Pages;

public class IndexModel
    : PageModel
{
    private const string Slug = "home";

    private readonly StoryblokContentDeliveryApiClient storyblokApiClient;
    private readonly ILogger<IndexModel> logger;

    public Story<PageBlock>? Story { get; private set; }

    public IndexModel(
        StoryblokContentDeliveryApiClient storyblokApiClient,
        ILogger<IndexModel> logger)
    {
        this.storyblokApiClient = storyblokApiClient;
        this.logger = logger;
    }

    public async Task<IActionResult> OnGetAsync()
    {
        var response = await storyblokApiClient.Stories.GetSingleAsync<PageBlock>(Slug);

        if (response.Data == null)
        {
            logger.LogError(
                response.Error?.Exception,
                "Request to fetch story with slug '{Slug}' failed with status code {StatusCode}. Error: {ErrorMessage}",
                Slug,
                response.Error?.StatusCode,
                response.Error?.ErrorMessage ?? response.Error?.StatusDescription ?? "Unknown.");

            return NotFound();
        }

        Story = response.Data.Story;

        return Page();
    }
}
