using StoryblokDotNet.ContentDelivery;
using StoryblokDotNet.ContentDelivery.Stories;
using WebApp.Features.Pages.Layout;
using WebApp.Features.Storyblok.Blocks;

namespace WebApp.Features.Storyblok.Layout;

public class StoryblokPageLayoutContextProvider
    : DefaultPageLayoutContextProvider
{
    private const string GlobalSlug = "global";

    private readonly StoryblokContentDeliveryApiClient storyblokApiClient;

    public StoryblokPageLayoutContextProvider(
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
