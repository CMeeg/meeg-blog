using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery.Stories;

public sealed class StoryField
    : SmartEnum<StoryField, string>
{
    public static readonly new StoryField Name = new(nameof(Name), StoryFieldName.Name);
    public static readonly StoryField CreatedAt = new(nameof(CreatedAt), StoryFieldName.CreatedAt);
    public static readonly StoryField PublishedAt = new(nameof(PublishedAt), StoryFieldName.PublishedAt);
    public static readonly StoryField UpdatedAt = new(nameof(UpdatedAt), StoryFieldName.UpdatedAt);
    public static readonly StoryField Id = new(nameof(Id), StoryFieldName.Id);
    public static readonly StoryField Uuid = new(nameof(Uuid), StoryFieldName.Uuid);
    public static readonly StoryField Content = new(nameof(Content), StoryFieldName.Content);
    public static readonly StoryField Slug = new(nameof(Slug), StoryFieldName.Slug);
    public static readonly StoryField FullSlug = new(nameof(FullSlug), StoryFieldName.FullSlug);
    public static readonly StoryField SortByDate = new(nameof(SortByDate), StoryFieldName.SortByDate);
    public static readonly StoryField Position = new(nameof(Position), StoryFieldName.Position);
    public static readonly StoryField TagList = new(nameof(TagList), StoryFieldName.TagList);
    public static readonly StoryField IsStartpage = new(nameof(IsStartpage), StoryFieldName.IsStartpage);
    public static readonly StoryField ParentId = new(nameof(ParentId), StoryFieldName.ParentId);
    public static readonly StoryField MetaData = new(nameof(MetaData), StoryFieldName.MetaData);
    public static readonly StoryField GroupId = new(nameof(GroupId), StoryFieldName.GroupId);
    public static readonly StoryField FirstPublishedAt = new(nameof(FirstPublishedAt), StoryFieldName.FirstPublishedAt);
    public static readonly StoryField ReleaseId = new(nameof(ReleaseId), StoryFieldName.ReleaseId);
    public static readonly StoryField Lang = new(nameof(Lang), StoryFieldName.Lang);
    public static readonly StoryField Path = new(nameof(Path), StoryFieldName.Path);
    public static readonly StoryField Alternates = new(nameof(Alternates), StoryFieldName.Alternates);
    public static readonly StoryField DefaultFullSlug = new(nameof(DefaultFullSlug), StoryFieldName.DefaultFullSlug);
    public static readonly StoryField TranslatedSlugs = new(nameof(TranslatedSlugs), StoryFieldName.TranslatedSlugs);

    public string EnumName => base.Name;

    private StoryField(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public static class StoryFieldName
{
    public const string Name = "name";
    public const string CreatedAt = "created_at";
    public const string PublishedAt = "published_at";
    public const string UpdatedAt = "updated_at";
    public const string Id = "id";
    public const string Uuid = "uuid";
    public const string Content = "content";
    public const string Slug = "slug";
    public const string FullSlug = "full_slug";
    public const string SortByDate = "sort_by_date";
    public const string Position = "position";
    public const string TagList = "tag_list";
    public const string IsStartpage = "is_startpage";
    public const string ParentId = "parent_id";
    public const string MetaData = "meta_data";
    public const string GroupId = "group_id";
    public const string FirstPublishedAt = "first_published_at";
    public const string ReleaseId = "release_id";
    public const string Lang = "lang";
    public const string Path = "path";
    public const string Alternates = "alternates";
    public const string DefaultFullSlug = "default_full_slug";
    public const string TranslatedSlugs = "translated_slugs";
}
