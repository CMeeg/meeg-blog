namespace StoryblokDotNet.ContentDelivery;

public class Story<T>
    where T : StoryBlock
{
    public required string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int Id { get; set; }
    public Guid Uuid { get; set; }
    public required T Content { get; set; }
    public required string Slug { get; set; }
    public required string FullSlug { get; set; }
    public DateOnly? SortByDate { get; set; }
    public int Position { get; set; }
    public required string[] TagList { get; set; }
    public bool IsStartpage { get; set; }
    public int? ParentId { get; set; }
    public object? MetaData { get; set; }
    public Guid GroupId { get; set; }
    public DateTime FirstPublishedAt { get; set; }
    public int? ReleaseId { get; set; }
    public required string Lang { get; set; }
    public string? Path { get; set; }
    public required StoryAlternate[] Alternates { get; set; }
    public string? DefaultFullSlug { get; set; }
    public required StoryTranslatedSlug[]? TranslatedSlugs { get; set; }
}

public class StoryAlternate
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public bool Published { get; set; }
    public required string FullSlug { get; set; }
    public bool IsFolder { get; set; }
}

public class StoryTranslatedSlug
{
    public required string Path { get; set; }
    public required string Name { get; set; }
    public required string Lang { get; set; }
    public bool Published { get; set; }
}
