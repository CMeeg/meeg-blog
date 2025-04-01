namespace StoryblokDotNet.ContentDelivery.Stories;

public class Story<T>
    where T : StoryBlock
{
    public string Name { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? PublishedAt { get; init; }
    public DateTime UpdatedAt { get; private set; }
    public int Id { get; private set; }
    public Guid Uuid { get; private set; }
    public T Content { get; private set; }
    public  string Slug { get; private set; }
    public string FullSlug { get; private set; }
    public DateOnly? SortByDate { get; init; }
    public int Position { get; private set; }
    public string[] TagList { get; private set; }
    public bool IsStartpage { get; private set; }
    public int? ParentId { get; init; }
    public Dictionary<string, object>? MetaData { get; init; }
    public Guid GroupId { get; private set; }
    public DateTime FirstPublishedAt { get; private set; }
    public int? ReleaseId { get; init; }
    public string Lang { get; private set; }
    public string? Path { get; init; }
    public StoryAlternate[] Alternates { get; private set; }
    public string? DefaultFullSlug { get; init; }
    public StoryTranslatedSlug[]? TranslatedSlugs { get; private set; }

    public Story(
        string name,
        DateTime createdAt,
        DateTime updatedAt,
        int id,
        Guid uuid,
        T content,
        string slug,
        string fullSlug,
        int position,
        string[] tagList,
        bool isStartpage,
        Guid groupId,
        DateTime firstPublishedAt,
        string lang,
        StoryAlternate[] alternates,
        StoryTranslatedSlug[]? translatedSlugs)
    {
        Name = name;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        Id = id;
        Uuid = uuid;
        Content = content;
        Slug = slug;
        FullSlug = fullSlug;
        Position = position;
        TagList = tagList;
        IsStartpage = isStartpage;
        GroupId = groupId;
        FirstPublishedAt = firstPublishedAt;
        Lang = lang;
        Alternates = alternates;
        TranslatedSlugs = translatedSlugs;
    }
}

public class StoryAlternate
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Slug { get; private set; }
    public bool Published { get; private set; }
    public string FullSlug { get; private set; }
    public bool IsFolder { get; private set; }

    public StoryAlternate(
        int id,
        string name,
        string slug,
        bool published,
        string fullSlug,
        bool isFolder)
    {
        Id = id;
        Name = name;
        Slug = slug;
        Published = published;
        FullSlug = fullSlug;
        IsFolder = isFolder;
    }
}

public class StoryTranslatedSlug
{
    public string Path { get; private set; }
    public string Name { get; private set; }
    public string Lang { get; private set; }
    public bool Published { get; private set; }

    public StoryTranslatedSlug(
        string path,
        string name,
        string lang,
        bool published)
    {
        Path = path;
        Name = name;
        Lang = lang;
        Published = published;
    }
}
