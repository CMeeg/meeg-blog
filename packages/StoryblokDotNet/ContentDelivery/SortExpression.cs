using System.Globalization;
using System.Text;
using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery;

public interface ISortExpression
{
    CompoundSortExpression ThenBy(SortExpression expression);
}

public class CompoundSortExpression
    : ISortExpression
{
    private readonly List<SortExpression> expressions;

    public SortExpression[] Expressions => expressions.ToArray();

    public CompoundSortExpression(params SortExpression[] expressions)
    {
        this.expressions = [.. expressions];
    }

    public CompoundSortExpression ThenBy(SortExpression expression)
    {
        expressions.Add(expression);

        return this;
    }

    public override string ToString()
    {
        return string.Join(",", expressions);
    }
}

public class SortExpression
    : ISortExpression
{
    private const string CustomFieldPrefix = "content.";
    private const char Separator = ':';

    public string Field { get; private set; }
    public SortDirection Direction { get; private set; } = SortDirection.Ascending;
    public SortNumericType? SortNumeric { get; private set; }
    public SortNullsPosition? SortNulls { get; private set; }

    public SortExpression(
        string field,
        SortDirection? direction = null,
        SortNumericType? sortNumeric = null,
        SortNullsPosition? sortNulls = null)
    {
        Field = field.StartsWith(CustomFieldPrefix, StringComparison.InvariantCultureIgnoreCase)
            ? field
            : $"{CustomFieldPrefix}{field}";
        Direction = direction ?? SortDirection.Ascending;
        SortNumeric = sortNumeric;
        SortNulls = sortNulls;
    }

    public SortExpression(
        StoryField field,
        SortDirection? direction = null,
        SortNumericType? sortNumeric = null,
        SortNullsPosition? sortNulls = null)
    {
        Field = field.ToString();
        Direction = direction ?? SortDirection.Ascending;
        SortNumeric = sortNumeric;
        SortNulls = sortNulls;
    }

    public SortExpression Asc()
    {
        Direction = SortDirection.Ascending;

        return this;
    }

    public SortExpression Desc()
    {
        Direction = SortDirection.Descending;

        return this;
    }

    public SortExpression AsString()
    {
        SortNumeric = null;

        return this;
    }

    public SortExpression AsFloat()
    {
        SortNumeric = SortNumericType.AsFloat;

        return this;
    }

    public SortExpression AsInteger()
    {
        SortNumeric = SortNumericType.AsInteger;

        return this;
    }

    public SortExpression NullsDefault()
    {
        SortNulls = null;

        return this;
    }

    public SortExpression NullsFirst()
    {
        SortNulls = SortNullsPosition.First;

        return this;
    }

    public SortExpression NullsLast()
    {
        SortNulls = SortNullsPosition.Last;

        return this;
    }

    public CompoundSortExpression ThenBy(SortExpression expression)
    {
        return new CompoundSortExpression(this, expression);
    }

    public override string ToString()
    {
        var builder = new StringBuilder($"{Field}{Separator}{Direction}");

        if (SortNumeric is not null
            && !Field.StartsWith(CustomFieldPrefix, StringComparison.InvariantCultureIgnoreCase))
        {
            builder.Append(CultureInfo.InvariantCulture, $"{Separator}{SortNumeric}");
        }

        if (SortNulls is not null)
        {
            builder.Append(CultureInfo.InvariantCulture, $"{Separator}{SortNulls}");
        }

        return builder.ToString();
    }

    public static SortExpression By(string field)
    {
        return new SortExpression(field);
    }

    public static SortExpression By(StoryField field)
    {
        return new SortExpression(field);
    }
}

public sealed class SortDirection
    : SmartEnum<SortDirection, string>
{
    public static readonly SortDirection Ascending = new(nameof(Ascending), "asc");
    public static readonly SortDirection Descending = new(nameof(Descending), "desc");

    private SortDirection(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public sealed class SortNumericType
    : SmartEnum<SortNumericType, string>
{
    public static readonly SortNumericType AsFloat = new(nameof(AsFloat), "float");
    public static readonly SortNumericType AsInteger = new(nameof(AsInteger), "int");

    private SortNumericType(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public sealed class SortNullsPosition
    : SmartEnum<SortNullsPosition, string>
{
    public static readonly SortNullsPosition First = new(nameof(First), "nulls_first");
    public static readonly SortNullsPosition Last = new(nameof(Last), "nulls_last");

    private SortNullsPosition(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}
