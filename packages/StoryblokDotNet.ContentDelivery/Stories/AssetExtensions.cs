using System.Text.RegularExpressions;
using Ardalis.SmartEnum;
using StoryblokDotNet.ContentDelivery.ImageService;

namespace StoryblokDotNet.ContentDelivery.Stories;

public static partial class AssetExtensions
{
    // See: https://www.storyblok.com/docs/concepts/assets#asset-mime-types
    // TODO: Allow for user configuration of these?
    // TODO: Would be great if Storyblok provided the mime type in the Asset object
    private static readonly HashSet<string> imageExtensions = new()
    {
        ".avif", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"
    };
    private static readonly HashSet<string> videoExtensions = new()
    {
        ".3g2", ".3gp", ".avi", ".mp4", ".mpeg", ".ogv", ".ts", ".webm"
    };
    private static readonly HashSet<string> audioExtensions = new()
    {
        ".aac", ".flac", ".mid", ".midi", ".mp3", ".oga", ".ogg", ".opus", ".wav", ".weba"
    };
    private static readonly HashSet<string> textExtensions = new()
    {
        ".doc", ".docx", ".odt", ".pdf", ".txt"
    };

    [GeneratedRegex(@"/f/\d+/(\d+)x(\d+)/")]
    private static partial Regex ImageDimensionsRegex();

    public static bool IsEmpty(this Asset? asset)
    {
        return asset is null || string.IsNullOrWhiteSpace(asset.Filename);
    }

    public static AssetType GetAssetType(this Asset asset)
    {
        if (asset.IsEmpty())
        {
            return AssetType.Unknown;
        }

        string extension = Path.GetExtension(asset.Filename).ToLowerInvariant();

        if (imageExtensions.Contains(extension))
        {
            return AssetType.Image;
        }
        else if (videoExtensions.Contains(extension))
        {
            return AssetType.Video;
        }
        else if (audioExtensions.Contains(extension))
        {
            return AssetType.Audio;
        }
        else if (textExtensions.Contains(extension))
        {
            return AssetType.Text;
        }
        else
        {
            return AssetType.Unknown;
        }
    }

    public static string GetImageUrl(this Asset asset, IImageFilterExpression? expression = null)
    {
        if (asset.GetAssetType() != AssetType.Image || expression == null)
        {
            return asset.Filename;
        }

        return $"{asset.Filename}{expression}";
    }

    public static ImageDimensions? GetImageDimensions(this Asset asset)
    {
        if (asset.GetAssetType() != AssetType.Image)
        {
            return null;
        }

        // Extract the width and height from the filename using regex
        // For example: https://a.storyblok.com/f/86280/400x400/b445e2de7b/chris-meagher.jpg
        Regex regex = ImageDimensionsRegex();
        Match match = regex.Match(asset.Filename);

        if (match.Success && match.Groups.Count >= 3)
        {
            if (int.TryParse(match.Groups[1].Value, out int width) &&
                int.TryParse(match.Groups[2].Value, out int height))
            {
                return new ImageDimensions(width, height);
            }
        }

        return null;
    }

    public static ImageAsset? AsImage(this Asset asset, IImageFilterExpression? expression = null)
    {
        if (asset.GetAssetType() != AssetType.Image)
        {
            return null;
        }

        return new ImageAsset(asset, expression);
    }
}

public sealed class AssetType
    : SmartEnum<AssetType, string>
{
    public static readonly AssetType Image = new(nameof(Image), "image");
    public static readonly AssetType Video = new(nameof(Video), "video");
    public static readonly AssetType Audio = new(nameof(Audio), "audio");
    public static readonly AssetType Text = new(nameof(Text), "text");
    public static readonly AssetType Unknown = new(nameof(Unknown), "unknown");

    private AssetType(string name, string value)
        : base(name, value)
    {
    }
}

