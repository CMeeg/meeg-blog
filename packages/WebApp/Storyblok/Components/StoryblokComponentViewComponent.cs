using Microsoft.AspNetCore.Mvc;
using StoryblokDotNet.ContentDelivery.Stories;

namespace WebApp.Storyblok.Components;

public class StoryblokComponentViewComponent
    : ViewComponent
{
    private readonly IStoryBlockTypeRegistry storyBlockTypeRegistry;
    private readonly ILogger<StoryblokComponentViewComponent> logger;

    public StoryblokComponentViewComponent(
        IStoryBlockTypeRegistry storyBlockTypeRegistry,
        ILogger<StoryblokComponentViewComponent> logger)
    {
        this.storyBlockTypeRegistry = storyBlockTypeRegistry;
        this.logger = logger;
    }

    public IViewComponentResult Invoke(StoryBlock block)
    {
        ArgumentNullException.ThrowIfNull(block, nameof(block));

        // TODO: Support a fallback component?
        // TODO: Suppress error content in production?

        if (!storyBlockTypeRegistry.TryGetBlockType(block.Component, out StoryBlockType? blockType))
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
