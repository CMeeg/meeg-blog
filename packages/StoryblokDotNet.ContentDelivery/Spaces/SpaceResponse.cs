namespace StoryblokDotNet.ContentDelivery.Spaces;

public sealed class SpaceResponse
{
    public Space Space { get; private set; }

    public SpaceResponse(Space space)
    {
        Space = space;
    }
}
