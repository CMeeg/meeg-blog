using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebApp.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> logger;

    public IndexModel(ILogger<IndexModel> logger)
    {
        this.logger = logger;
    }
}
