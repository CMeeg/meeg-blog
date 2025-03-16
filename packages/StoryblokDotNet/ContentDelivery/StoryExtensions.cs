namespace StoryblokDotNet.ContentDelivery;

public static class StoryExtensions
{
    public static string Url<T>(this Story<T> story)
        where T : StoryBlock
    {
        if (story.Path != null)
        {
            return story.Path;
        }

        return $"/{story.FullSlug}";
    }
}
