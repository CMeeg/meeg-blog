using Microsoft.AspNetCore.Mvc;
using StoryblokDotNet.ContentDelivery;
using StoryblokDotNet.ContentDelivery.ImageService;
using StoryblokDotNet.ContentDelivery.Stories;
using WebApp.Features.Media;
using WebApp.Features.Storyblok.Blocks;

namespace WebApp.Features.Pages.Components;

public class HeaderViewComponent
    : ViewComponent
{
    private const string GlobalSlug = "global";

    private readonly StoryblokContentDeliveryApiClient storyblokApiClient;

    public HeaderViewComponent(StoryblokContentDeliveryApiClient storyblokApiClient)
    {
        this.storyblokApiClient = storyblokApiClient;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        // TODO: This same query is used in the MeegBlogPageLayoutContextProvider - remove duplication and add caching
        var globalResponse = await storyblokApiClient.Stories.GetSingleAsync<GlobalBlock>(GlobalSlug);
        Story<GlobalBlock>? globalStory = globalResponse.Data?.Story;

        if (globalStory is null)
        {
            // TODO: Maybe don't want to throw here when in "preview mode"? Display some kind of fallback component instead?
            throw new ArgumentNullException(nameof(globalStory), "Global story not found");
        }

        var logo = globalStory.Content.Logo.AsImage(ImageFilterExpression.ResizeWidth(140).AndWith(ImageFilterExpression.Quality(80)));
        if (logo is null)
        {
            // TODO: Maybe don't want to throw here when in "preview mode"? Display some kind of fallback component instead?
            throw new ArgumentNullException(nameof(logo), "Logo not found");
        }

        var model = new HeaderModel
        {
            Logo = new ImageModel
            {
                Src = logo.Src,
                Alt = logo.Alt ?? "Chris Meagher"
            },
            Editable = globalStory.Content.Editable
        };

        return View(model);
    }
}

public class HeaderModel
{
    public required ImageModel Logo { get; set; }
    public string? Editable { get; set; }
}
