using Microsoft.AspNetCore.Mvc;

namespace WebApp.Features.Pages.Layout;

public class PageHeadViewComponent
    : ViewComponent
{
    private readonly PageLayoutContext layoutContext;

    public PageHeadViewComponent(PageLayoutContext layoutContext)
    {
        this.layoutContext = layoutContext;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        PageHead head = await layoutContext.UseHeadAsync();

        return View(head);
    }
}
