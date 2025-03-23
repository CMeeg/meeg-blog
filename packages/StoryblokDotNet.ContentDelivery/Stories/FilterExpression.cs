using System.Globalization;
using Ardalis.SmartEnum;

namespace StoryblokDotNet.ContentDelivery.Stories;

public interface IFilterExpression
{
    CompoundFilterExpression AndBy(FilterExpression expression);
    CompoundFilterExpression OrBy(FilterExpression expression);
}

public class CompoundFilterExpression
    : IFilterExpression
{
    private const char Separator = '&';

    private readonly List<Tuple<FilterLogicalOperator, FilterExpression>> expressions;

    public Tuple<FilterLogicalOperator, FilterExpression>[] Expressions => expressions.ToArray();

    public CompoundFilterExpression(
        FilterLogicalOperator logicalOperator,
        params FilterExpression[] expressions)
    {
        this.expressions = [.. expressions.Select(expression => Tuple.Create(logicalOperator, expression))];
    }

    public CompoundFilterExpression AndBy(FilterExpression expression)
    {
        expressions.Add(Tuple.Create(FilterLogicalOperator.And, expression));

        return this;
    }

    public CompoundFilterExpression OrBy(FilterExpression expression)
    {
        expressions.Add(Tuple.Create(FilterLogicalOperator.Or, expression));

        return this;
    }

    public override string ToString()
    {
        var builder = new List<string>();

        foreach ((FilterLogicalOperator logicalOperator, FilterExpression expression) in expressions)
        {
            if (logicalOperator == FilterLogicalOperator.Or)
            {
                builder.Add($"{StoriesQueryParam.FilterQuery}[__{logicalOperator}][][{expression.Field}][{expression.Operator}]={string.Join(",", expression.Value)}");
            }
            else
            {
                builder.Add(expression.ToString());
            }
        }

        return string.Join(Separator, builder);
    }
}

public class FilterExpression
    : IFilterExpression
{
    public string Field { get; private set; }
    public FilterConditionOperator Operator { get; private set; }
    public string[] Value { get; private set; }

    public FilterExpression(
        string field,
        FilterConditionOperator @operator,
        params string[] value)
    {
        Field = field;
        Operator = @operator;
        Value = value;
    }

    public CompoundFilterExpression AndBy(FilterExpression expression)
    {
        return new CompoundFilterExpression(FilterLogicalOperator.And, this, expression);
    }

    public CompoundFilterExpression OrBy(FilterExpression expression)
    {
        return new CompoundFilterExpression(FilterLogicalOperator.Or, this, expression);
    }

    public override string ToString()
    {
        return $"{StoriesQueryParam.FilterQuery}[{Field}][{Operator}]={string.Join(",", Value)}";
    }

    public static FilterExpression IsEmpty(string field)
    {
        return new FilterExpression(field, FilterConditionOperator.Is, FilterValue.Empty);
    }

    public static FilterExpression IsNotEmpty(string field)
    {
        return new FilterExpression(field, FilterConditionOperator.Is, FilterValue.NotEmpty);
    }

    public static FilterExpression IsEmptyArray(string field)
    {
        return new FilterExpression(field, FilterConditionOperator.Is, FilterValue.EmptyArray);
    }

    public static FilterExpression IsNotEmptyArray(string field)
    {
        return new FilterExpression(field, FilterConditionOperator.Is, FilterValue.NotEmptyArray);
    }

    public static FilterExpression IsTrue(string field)
    {
        return new FilterExpression(field, FilterConditionOperator.Is, FilterValue.True);
    }

    public static FilterExpression IsFalse(string field)
    {
        return new FilterExpression(field, FilterConditionOperator.Is, FilterValue.False);
    }

    public static FilterExpression IsNull(string field)
    {
        return new FilterExpression(field, FilterConditionOperator.Is, FilterValue.Null);
    }

    public static FilterExpression IsNotNull(string field)
    {
        return new FilterExpression(field, FilterConditionOperator.Is, FilterValue.NotNull);
    }

    public static FilterExpression In(string field, params object[] values)
    {
        return new FilterExpression(field, FilterConditionOperator.In, ParseValues(values));
    }

    public static FilterExpression NotIn(string field, params object[] values)
    {
        return new FilterExpression(field, FilterConditionOperator.NotIn, ParseValues(values));
    }

    public static FilterExpression Like(string field, params object[] values)
    {
        return new FilterExpression(field, FilterConditionOperator.Like, ParseValues(values));
    }

    public static FilterExpression NotLike(string field, params object[] values)
    {
        return new FilterExpression(field, FilterConditionOperator.NotLike, ParseValues(values));
    }

    public static FilterExpression AnyInArray(string field, params object[] values)
    {
        return new FilterExpression(field, FilterConditionOperator.AnyInArray, ParseValues(values));
    }

    public static FilterExpression AllInArray(string field, params object[] values)
    {
        return new FilterExpression(field, FilterConditionOperator.AllInArray, ParseValues(values));
    }

    public static FilterExpression GreaterThanDate(string field, DateTime value)
    {
        return new FilterExpression(field, FilterConditionOperator.GreaterThanDate, ParseDateTime(value));
    }

    public static FilterExpression LessThanDate(string field, DateTime value)
    {
        return new FilterExpression(field, FilterConditionOperator.LessThanDate, ParseDateTime(value));
    }

    public static FilterExpression GreaterThanInt(string field, int value)
    {
        return new FilterExpression(field, FilterConditionOperator.GreaterThanInt, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterExpression LessThanInt(string field, int value)
    {
        return new FilterExpression(field, FilterConditionOperator.LessThanInt, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterExpression GreaterThanFloat(string field, double value)
    {
        return new FilterExpression(field, FilterConditionOperator.GreaterThanFloat, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterExpression GreaterThanFloat(string field, decimal value)
    {
        return new FilterExpression(field, FilterConditionOperator.GreaterThanFloat, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterExpression LessThanFloat(string field, double value)
    {
        return new FilterExpression(field, FilterConditionOperator.LessThanFloat, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterExpression LessThanFloat(string field, decimal value)
    {
        return new FilterExpression(field, FilterConditionOperator.LessThanFloat, value.ToString(CultureInfo.InvariantCulture));
    }

    private static string[] ParseValues(object[] values)
    {
        var stringValues = new List<string>();

        foreach(object value in values)
        {
            string? stringValue = value?.ToString();
            if(stringValue is not null)
            {
                stringValues.Add(stringValue);
            }
        }

        return stringValues.ToArray();
    }

    private static string ParseDateTime(DateTime value)
    {
        return string.Format(CultureInfo.InvariantCulture, "{0:yyyy-MM-dd HH:mm}", value);
    }
}

public sealed class FilterConditionOperator
    : SmartEnum<FilterConditionOperator, string>
{
    public static readonly FilterConditionOperator Is = new(nameof(Is), "is");
    public static readonly FilterConditionOperator In = new(nameof(In), "in");
    public static readonly FilterConditionOperator NotIn = new(nameof(NotIn), "not_in");
    public static readonly FilterConditionOperator Like = new(nameof(Like), "like");
    public static readonly FilterConditionOperator NotLike = new(nameof(NotLike), "not_like");
    public static readonly FilterConditionOperator AnyInArray = new(nameof(AnyInArray), "any_in_array");
    public static readonly FilterConditionOperator AllInArray = new(nameof(AllInArray), "all_in_array");
    public static readonly FilterConditionOperator GreaterThanDate = new(nameof(GreaterThanDate), "gt_date");
    public static readonly FilterConditionOperator LessThanDate = new(nameof(LessThanDate), "lt_date");
    public static readonly FilterConditionOperator GreaterThanInt = new(nameof(GreaterThanInt), "gt_int");
    public static readonly FilterConditionOperator LessThanInt = new(nameof(LessThanInt), "lt_int");
    public static readonly FilterConditionOperator GreaterThanFloat = new(nameof(GreaterThanFloat), "gt_float");
    public static readonly FilterConditionOperator LessThanFloat = new(nameof(LessThanFloat), "lt_float");

    private FilterConditionOperator(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public sealed class FilterLogicalOperator
    : SmartEnum<FilterLogicalOperator, string>
{
    public static readonly FilterLogicalOperator And = new(nameof(And), "and");
    public static readonly FilterLogicalOperator Or = new(nameof(Or), "or");

    private FilterLogicalOperator(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}

public sealed class FilterValue
    : SmartEnum<FilterValue, string>
{
    public static readonly FilterValue Empty = new(nameof(Empty), "empty");
    public static readonly FilterValue NotEmpty = new(nameof(NotEmpty), "not_empty");
    public static readonly FilterValue EmptyArray = new(nameof(EmptyArray), "empty_array");
    public static readonly FilterValue NotEmptyArray = new(nameof(NotEmptyArray), "not_empty_array");
    public static readonly FilterValue True = new(nameof(True), "true");
    public static readonly FilterValue False = new(nameof(False), "false");
    public static readonly FilterValue Null = new(nameof(Null), "null");
    public static readonly FilterValue NotNull = new(nameof(NotNull), "not_null");

    private FilterValue(string name, string value)
        : base(name, value)
    {
    }

    public override string ToString() => Value;
}
