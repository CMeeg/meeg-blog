namespace StoryblokDotNet.ContentDelivery.Spaces;

public class Space
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Domain { get; private set; }
    public long Version { get; private set; }
    public string[] LanguageCodes { get; private set; }

    public Space(
        int id,
        string name,
        string domain,
        long version,
        string[] languageCodes)
    {
        Id = id;
        Name = name;
        Domain = domain;
        Version = version;
        LanguageCodes = languageCodes;
    }
}
