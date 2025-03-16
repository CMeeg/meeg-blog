using Microsoft.AspNetCore.Mvc;
using StoryblokDotNet.ContentDelivery;

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

    public IViewComponentResult Invoke(StoryBlock block)
    {
        ArgumentNullException.ThrowIfNull(block, nameof(block));

        // TODO: Support a fallback component?
        // TODO: Suppress error content in production?

        if (!StoryBlockTypeRegister.Types.TryGetValue(block.Component, out var blockType))
        {
            logger.LogError("Component block type not found: {Component}", block.Component);

            return Content($"Component block type not found: {block.Component}");
        }

        string viewName = string.IsNullOrEmpty(blockType.View)
            ? blockType.Type.Name
            : blockType.View;

        logger.LogTrace("Rendering component for block type '{Component}' with view '{View}'.", blockType.Name, viewName);

        return View(viewName, block);
    }
}
