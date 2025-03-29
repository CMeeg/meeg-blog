namespace WebApp.Features.Pages.Layout;

public class PageLayoutContext
{
    private readonly IPageLayoutContextProvider contextProvider;

    private PageHead? head;
    private HtmlAttributeCollection? htmlAttributes;

    public PageLayoutContext(IPageLayoutContextProvider contextProvider)
    {
        this.contextProvider = contextProvider;
    }

    public async Task<PageHead> UseHeadAsync()
    {
        head ??= await contextProvider.CreatePageHeadAsync();

        return head;
    }

    public async Task<HtmlAttributeCollection> UseHtmlAttributesAsync()
    {
        htmlAttributes ??= await contextProvider.CreateHtmlAttributesAsync();

        return htmlAttributes;
    }
}

public class PageHead
{
    public required PageMetadata Metadata { get; set; }
    public OpenGraphMetadata? OpenGraph { get; set; }
}

public class HtmlAttributeCollection
    : Dictionary<string, object>
{
}
