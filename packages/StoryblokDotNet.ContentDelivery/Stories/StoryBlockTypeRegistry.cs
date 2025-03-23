using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using Microsoft.Extensions.Logging;

namespace StoryblokDotNet.ContentDelivery.Stories;

public interface IStoryBlockTypeRegistry
{
    StoryBlockType GetBlockType(string technicalName);
    bool TryGetBlockType(string technicalName, [MaybeNullWhen(false)] out StoryBlockType blockType);
}

public abstract class StoryBlockTypeRegistryBase
    : IStoryBlockTypeRegistry
{
    protected ConcurrentDictionary<string, StoryBlockType> Types { get; } = [];

    public StoryBlockType GetBlockType(string technicalName)
    {
        if (!Types.TryGetValue(technicalName, out StoryBlockType? blockType))
        {
            throw new KeyNotFoundException($"Block type '{technicalName}' not found.");
        }

        return blockType;
    }

    public bool TryGetBlockType(string technicalName, [MaybeNullWhen(false)] out StoryBlockType blockType)
    {
        return Types.TryGetValue(technicalName, out blockType);
    }
}

public sealed class AssemblyScanningStoryBlockTypeRegistry
    : StoryBlockTypeRegistryBase
{
    public AssemblyScanningStoryBlockTypeRegistry(
        IEnumerable<Assembly> assemblies,
        ILogger<AssemblyScanningStoryBlockTypeRegistry> logger)
    {
        var blockTypes = from a in assemblies
            from t in a.GetTypes()
            let attributes = t.GetCustomAttributes(typeof(StoryBlockTypeAttribute), true)
            where attributes != null && attributes.Length > 0
            select new { Type = t, Attribute = attributes.Cast<StoryBlockTypeAttribute>().First() };

        foreach (var blockType in blockTypes)
        {
            if (!Types.TryAdd(blockType.Attribute.Name, new StoryBlockType
            {
                Name = blockType.Attribute.Name,
                Type = blockType.Type,
                View = blockType.Attribute.View
            }))
            {
                logger.LogWarning("Could not register '{Type}' because Block Type '{BlockType}' has already been registered.", blockType.Type.FullName, blockType.Attribute.Name);
            }
        }
    }
}
