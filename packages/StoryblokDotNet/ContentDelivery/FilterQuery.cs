using System.Globalization;
using System.Text;

namespace StoryblokDotNet.ContentDelivery;

public class FilterQuery
{
    public string Field { get; private set; }
    public string Operator { get; private set; }
    public string[] Value { get; private set; }
    public string LogicalOperator { get; private set; } = LogicalOperatorType.And;
    public List<FilterQuery> CompoundQueries { get; private set; } = [];

    private FilterQuery(
        string field,
        string @operator,
        params string[] value)
        : this(field, @operator, LogicalOperatorType.And, value)
    {
    }

    private FilterQuery(
        string field,
        string @operator,
        string logicalOperator,
        params string[] value)
    {
        Field = field;
        Operator = @operator;
        LogicalOperator = logicalOperator;
        Value = value;
    }

    public string[] Build()
    {
        var values = new List<string>
        {
            ToQueryString()
        };

        foreach (FilterQuery query in CompoundQueries)
        {
            values.AddRange(query.Build());
        }

        return values.ToArray();
    }

    public override string ToString()
    {
        return string.Join("&", Build());
    }

    private string ToQueryString()
    {
        if (LogicalOperator == LogicalOperatorType.Or)
        {
            return $"{StoriesQueryParam.FilterQuery}[__{LogicalOperator}][][{Field}][{Operator}]={string.Join(",", Value)}";
        }
        else
        {
            return $"{StoriesQueryParam.FilterQuery}[{Field}][{Operator}]={string.Join(",", Value)}";
        }
    }

    public static FilterQuery IsEmpty(string field)
    {
        return new FilterQuery(field, OperatorType.Is, ValueType.Empty);
    }

    public static FilterQuery IsNotEmpty(string field)
    {
        return new FilterQuery(field, OperatorType.Is, ValueType.NotEmpty);
    }

    public static FilterQuery IsEmptyArray(string field)
    {
        return new FilterQuery(field, OperatorType.Is, ValueType.EmptyArray);
    }

    public static FilterQuery IsNotEmptyArray(string field)
    {
        return new FilterQuery(field, OperatorType.Is, ValueType.NotEmptyArray);
    }

    public static FilterQuery IsTrue(string field)
    {
        return new FilterQuery(field, OperatorType.Is, ValueType.True);
    }

    public static FilterQuery IsFalse(string field)
    {
        return new FilterQuery(field, OperatorType.Is, ValueType.False);
    }

    public static FilterQuery IsNull(string field)
    {
        return new FilterQuery(field, OperatorType.Is, ValueType.Null);
    }

    public static FilterQuery IsNotNull(string field)
    {
        return new FilterQuery(field, OperatorType.Is, ValueType.NotNull);
    }

    public static FilterQuery In(string field, params object[] values)
    {
        return new FilterQuery(field, OperatorType.In, ParseValues(values));
    }

    public static FilterQuery NotIn(string field, params object[] values)
    {
        return new FilterQuery(field, OperatorType.NotIn, ParseValues(values));
    }

    public static FilterQuery Like(string field, params object[] values)
    {
        return new FilterQuery(field, OperatorType.Like, ParseValues(values));
    }

    public static FilterQuery NotLike(string field, params object[] values)
    {
        return new FilterQuery(field, OperatorType.NotLike, ParseValues(values));
    }

    public static FilterQuery AnyInArray(string field, params object[] values)
    {
        return new FilterQuery(field, OperatorType.AnyInArray, ParseValues(values));
    }

    public static FilterQuery AllInArray(string field, params object[] values)
    {
        return new FilterQuery(field, OperatorType.AllInArray, ParseValues(values));
    }

    public static FilterQuery GreaterThanDate(string field, DateTime value)
    {
        return new FilterQuery(field, OperatorType.GtDate, ParseDateTime(value));
    }

    public static FilterQuery LessThanDate(string field, DateTime value)
    {
        return new FilterQuery(field, OperatorType.LtDate, ParseDateTime(value));
    }

    public static FilterQuery GreaterThanInt(string field, int value)
    {
        return new FilterQuery(field, OperatorType.GtInt, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterQuery LessThanInt(string field, int value)
    {
        return new FilterQuery(field, OperatorType.LtInt, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterQuery GreaterThanFloat(string field, double value)
    {
        return new FilterQuery(field, OperatorType.GtFloat, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterQuery GreaterThanFloat(string field, decimal value)
    {
        return new FilterQuery(field, OperatorType.GtFloat, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterQuery LessThanFloat(string field, double value)
    {
        return new FilterQuery(field, OperatorType.LtFloat, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterQuery LessThanFloat(string field, decimal value)
    {
        return new FilterQuery(field, OperatorType.LtFloat, value.ToString(CultureInfo.InvariantCulture));
    }

    public static FilterQuery BlockType(string technicalName)
    {
        return In(StoryBlockField.Component, technicalName);
    }

    public FilterQuery AndBy(FilterQuery query)
    {
        // Ensure that the correct logical operator is set
        query.LogicalOperator = LogicalOperatorType.And;

        CompoundQueries.Add(query);

        return this;
    }

    public FilterQuery OrBy(FilterQuery query)
    {
        // Ensure that the correct logical operator is set
        FilterQuery previousQuery = CompoundQueries.Count == 0
            ? this
            : CompoundQueries.Last();

        previousQuery.LogicalOperator = LogicalOperatorType.Or;
        query.LogicalOperator = LogicalOperatorType.Or;

        CompoundQueries.Add(query);

        return this;
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

    private static class OperatorType
    {
        public const string Is = "is";
        public const string In = "in";
        public const string NotIn = "not_in";
        public const string Like = "like";
        public const string NotLike = "not_like";
        public const string AnyInArray = "any_in_array";
        public const string AllInArray = "all_in_array";
        public const string GtDate = "gt_date";
        public const string LtDate = "lt_date";
        public const string GtInt = "gt_int";
        public const string LtInt = "lt_int";
        public const string GtFloat = "gt_float";
        public const string LtFloat = "lt_float";
    }

    private static class ValueType
    {
        public const string Empty = "empty";
        public const string NotEmpty = "not_empty";
        public const string EmptyArray = "empty_array";
        public const string NotEmptyArray = "not_empty_array";
        public const string True = "true";
        public const string False = "false";
        public const string Null = "null";
        public const string NotNull = "not_null";
    }

    private static class LogicalOperatorType
    {
        public const string And = "and";
        public const string Or = "or";
    }
}
