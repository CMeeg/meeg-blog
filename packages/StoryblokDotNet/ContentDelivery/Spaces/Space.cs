namespace StoryblokDotNet.ContentDelivery.Spaces;

public class Space
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Domain { get; set; }
    public long Version { get; set; }
    public required string[] LanguageCodes { get; set; }
}
