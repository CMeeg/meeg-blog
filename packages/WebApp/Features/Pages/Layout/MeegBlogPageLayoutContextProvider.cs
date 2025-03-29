using StoryblokDotNet.ContentDelivery;
using StoryblokDotNet.ContentDelivery.Stories;
using WebApp.Features.Storyblok.Blocks;
using WebApp.Features.Storyblok.Layout;

namespace WebApp.Features.Pages.Layout;

public class MeegBlogPageLayoutContextProvider
    : DefaultPageLayoutContextProvider
{
    private const string GlobalSlug = "global";

    private readonly StoryblokContentDeliveryApiClient storyblokApiClient;

    public MeegBlogPageLayoutContextProvider(
        StoryblokContentDeliveryApiClient storyblokApiClient,
        IHttpContextAccessor httpContextAccessor)
        : base(httpContextAccessor)
    {
        this.storyblokApiClient = storyblokApiClient;
    }

    public override async Task<PageHead> CreatePageHeadAsync()
    {
        PageHead pageHead = await base.CreatePageHeadAsync();

        var globalResponse = await storyblokApiClient.Stories.GetSingleAsync<GlobalBlock>(GlobalSlug);
        Story<GlobalBlock>? globalStory = globalResponse.Data?.Story;

        pageHead.MergeWith(globalStory?.Content);

        return pageHead;
    }
}
