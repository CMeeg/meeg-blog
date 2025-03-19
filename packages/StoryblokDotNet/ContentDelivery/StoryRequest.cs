namespace StoryblokDotNet.ContentDelivery;

public sealed class StoryRequest
{
    public StoryIdentifier Identifier { get; private set; }
    public StoryQuery Query { get; private set; }

    public StoryRequest(string fullSlug, StoryQuery query)
    {
        Identifier = fullSlug;
        Query = query;

        Query.FindBy = null;
    }

    public StoryRequest(int id, StoryQuery query)
    {
        Identifier = id;
        Query = query;

        Query.FindBy = null;
    }

    public StoryRequest(Guid uuid, StoryQuery query)
    {
        Identifier = uuid;
        Query = query;

        Query.FindBy = StoryIdentifierType.Uuid;
    }

    public StoryRequest(StoryIdentifier identifier, StoryQuery query)
    {
        Identifier = identifier;
        Query = query;

        Query.FindBy = identifier.IdentifierType == StoryIdentifierType.Uuid
            ? StoryIdentifierType.Uuid
            : null;
    }
}
