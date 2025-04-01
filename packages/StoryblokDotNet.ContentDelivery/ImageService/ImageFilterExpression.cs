using System.Globalization;
using System.Text;
using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery.ImageService;

public interface IImageFilterExpression
{
    CompoundImageFilterExpression AndWith(ImageFilterExpression expression);
}

public class CompoundImageFilterExpression
    : IImageFilterExpression
{
    private const char ParameterSeparator = '/';
    private const char FilterSeparator = ':';

    private readonly List<ImageFilterExpression> expressions;

    public ImageFilterExpression[] Expressions => expressions.ToArray();

    public CompoundImageFilterExpression(params ImageFilterExpression[] expressions)
    {
        this.expressions = [.. expressions];
    }

    public CompoundImageFilterExpression AndWith(ImageFilterExpression expression)
    {
        expressions.Add(expression);

        return this;
    }

    public override string ToString()
    {
        List<string> parameters = [];
        List<string> filters = [];

        foreach (ImageFilterExpression expression in expressions)
        {
            string expressionValue = expression.ToParameterString();

            if (string.IsNullOrEmpty(expressionValue))
            {
                continue;
            }

            if (string.IsNullOrEmpty(expression.Name))
            {
                parameters.Add(expressionValue);

                continue;
            }

            filters.Add(expressionValue);
        }

        if (parameters.Count == 0 && filters.Count == 0)
        {
            return string.Empty;
        }

        var filterExpression = new StringBuilder(ImageFilterPath.ExpressionPrefix);

        if (parameters.Count > 0)
        {
            filterExpression.Append(string.Join(ParameterSeparator, parameters));
        }

        if (filters.Count > 0)
        {
            if (parameters.Count > 0)
            {
                filterExpression.Append(ParameterSeparator);
            }

            filterExpression.Append(ImageFilterPath.FiltersPrefix);
            filterExpression.Append(string.Join(FilterSeparator, filters));
        }

        return filterExpression.ToString();
    }
}

public class ImageFilterExpression
    : IImageFilterExpression
{
    public string? Name { get; private set; }
    public string? Value { get; private set; }

    public ImageFilterExpression(string name, string? value)
    {
        Name = name;
        Value = value;
    }

    public ImageFilterExpression(string value)
    {
        Value = value;
    }

    public CompoundImageFilterExpression AndWith(ImageFilterExpression expression)
    {
        return new CompoundImageFilterExpression(this, expression);
    }

    public override string ToString()
    {
        string value = ToParameterString();

        if (string.IsNullOrEmpty(value))
        {
            return string.Empty;
        }

        if (string.IsNullOrEmpty(Name))
        {
            return $"{ImageFilterPath.ExpressionPrefix}{value}";
        }

        return $"{ImageFilterPath.ExpressionPrefix}{ImageFilterPath.FiltersPrefix}{value}";
    }

    public virtual string ToParameterString()
    {
        if (string.IsNullOrEmpty(Name))
        {
            return Value ?? string.Empty;
        }

        return $"{Name}({Value ?? string.Empty})";
    }

    public static ImageFilterExpression Format(ImageFormat format)
    {
        return new ImageFilterExpression(ImageFilterName.Format, format);
    }

    public static ImageFilterExpression Quality(int quality)
    {
        return new ImageFilterExpression(
            ImageFilterName.Quality,
            Math.Clamp(quality, 0, 100).ToString(CultureInfo.InvariantCulture));
    }

    public static ImageFilterExpression Resize(int width, int height)
    {
        return new ImageFilterExpression($"{Math.Max(0, width)}x{Math.Max(0, height)}");
    }

    public static ImageFilterExpression ResizeWidth(int width)
    {
        return Resize(width, 0);
    }

    public static ImageFilterExpression ResizeHeight(int height)
    {
        return Resize(0, height);
    }

    // TODO: Fit-in
    // TODO: Focal point
    // TODO: Crop
    // TODO: Brightness
    // TODO: Blur
    // TODO: Grayscale
    // TODO: Rotate
    // TODO: Flip
    // TODO: Rounded corners
}

public static class ImageFilterPath
{
    public const string ExpressionPrefix = "/m/";
    public const string FiltersPrefix = "filters:";
}

public static class ImageFilterName
{
    public const string Format = "format";
    public const string Quality = "quality";
    public const string Resize = "resize";
}

public sealed class ImageFormat
    : SmartEnum<ImageFormat, string>
{
    public static readonly ImageFormat WebP = new(nameof(WebP), "webp");
    public static readonly ImageFormat Jpeg = new(nameof(Jpeg), "jpeg");
    public static readonly ImageFormat Png = new(nameof(Png), "png");
    public static readonly ImageFormat Avif = new(nameof(Avif), "avif");

    private ImageFormat(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString()
    {
        return Value;
    }
}
