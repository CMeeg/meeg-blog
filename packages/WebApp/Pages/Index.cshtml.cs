using System.Globalization;
using Adliance.Storyblok;
using Adliance.Storyblok.Clients;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using WebApp.Storyblok.Blocks;

namespace WebApp.Pages;

public class IndexModel
    : PageModel
{
    private const string Slug = "home";

    private readonly StoryblokStoryClient storyClient;
    private readonly ILogger<IndexModel> logger;

    public StoryblokStory<PageBlock>? Story { get; private set; }

    public IndexModel(
        StoryblokStoryClient storyClient,
        ILogger<IndexModel> logger)
    {
        this.storyClient = storyClient;
        this.logger = logger;
    }

    public async Task<IActionResult> OnGetAsync()
    {
        Story = await storyClient.Story()
            .WithCulture(CultureInfo.CurrentUICulture)
            .WithSlug(Slug)
            .Load<PageBlock>();

        if (Story == null)
        {
            logger.LogError("Story with '{Slug}' not found.", Slug);

            return NotFound();
        }

        return Page();
    }
}
