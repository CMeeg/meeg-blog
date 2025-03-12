using Adliance.Storyblok;
using Microsoft.AspNetCore.Mvc;

namespace WebApp.Storyblok.Components;

public class StoryblokComponentViewComponent
    : ViewComponent
{
    private readonly ILogger<StoryblokComponentViewComponent> logger;

    public StoryblokComponentViewComponent(
        ILogger<StoryblokComponentViewComponent> logger)
    {
        this.logger = logger;
    }

    public IViewComponentResult Invoke(StoryblokComponent component)
    {
        ArgumentNullException.ThrowIfNull(component);

        // TODO: Support a fallback component?
        // TODO: Suppress error content in production?

        if (!StoryblokMappings.Mappings.TryGetValue(component.Component, out var componentMapping))
        {
            logger.LogError("Component mapping for '{Component}' not found.", component.Component);

            return Content($"Component mapping for '{component.Component}' not found.");
        }

        string viewName = string.IsNullOrEmpty(componentMapping.View)
            ? componentMapping.Type.Name
            : componentMapping.View;

        logger.LogTrace("Rendering component '{Component}' with view '{View}'.", componentMapping.ComponentName, viewName);

        return View(viewName, component);
    }
}
