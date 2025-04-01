using Ardalis.SmartEnum;
using StoryblokDotNet.ContentDelivery.Stories;

namespace StoryblokDotNet.ContentDelivery.ImageService;

public class ImageAsset
    : Asset
{
    public string Src { get; }
    public ImageDimensions? RawDimensions { get; }

    public ImageAsset(Asset asset, IImageFilterExpression? expression)
        : base (asset.Name, asset.Filename, asset.Fieldtype)
    {
        AssetType assetType = asset.GetAssetType();

        if (assetType != AssetType.Image)
        {
            throw new ArgumentException(
                $"Expected asset with filename '{asset.Filename}' to be of type '{AssetType.Image}', but it is of type '{assetType}'.",
                nameof(asset));
        }

        Id = asset.Id;
        Alt = asset.Alt;
        Focus = asset.Focus;
        Title = asset.Title;
        Source = asset.Source;
        Copyright = asset.Copyright;
        MetaData = asset.MetaData;
        IsExternalUrl = asset.IsExternalUrl;

        Src = asset.GetImageUrl(expression);
        RawDimensions = asset.GetImageDimensions();
    }
}

public class ImageDimensions
{
    public int Width { get; init; }
    public int Height { get; init; }
    public ImageOrientation Orientation { get; }
    public string AspectRatio { get; }

    public ImageDimensions(int width, int height)
    {
        Width = width;
        Height = height;
        Orientation = CalculateOrientation(width, height);
        AspectRatio = CalculateAspectRatio(width, height);
    }

    private static ImageOrientation CalculateOrientation(int width, int height)
    {
        if (width > height)
        {
            return ImageOrientation.Landscape;
        }

        if (width < height)
        {
            return ImageOrientation.Portrait;
        }

        return ImageOrientation.Square;
    }

    private static string CalculateAspectRatio(int width, int height)
    {
        if (width == 0)
        {
            return "0:1";
        }

        if (height == 0)
        {
            return "1:0";
        }

        if (width == height)
        {
            return "1:1";
        }

        int gcd = CalculateGcd(width, height);
        return $"{width / gcd}:{height / gcd}";
    }

    // Greatest Common Divisor (GCD) calculation
    private static int CalculateGcd(int a, int b)
    {
        while (b != 0)
        {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}

public sealed class ImageOrientation
    : SmartEnum<ImageOrientation, string>
{
    public static readonly ImageOrientation Landscape = new(nameof(Landscape), "landscape");
    public static readonly ImageOrientation Portrait = new(nameof(Portrait), "portrait");
    public static readonly ImageOrientation Square = new(nameof(Square), "square");

    private ImageOrientation(string name, string value)
        : base(name, value)
    {
    }
}
