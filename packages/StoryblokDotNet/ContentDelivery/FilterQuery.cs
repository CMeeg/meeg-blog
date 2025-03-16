using System.Globalization;

namespace StoryblokDotNet.ContentDelivery;

public interface IFilterQuery
{
    LogicalFilterQuery AndBy(FilterQuery query);
    LogicalFilterQuery OrBy(FilterQuery query);
}

public class FilterQuery
    : IFilterQuery
{
    public string Field { get; private set; }
    public string Operator { get; private set; }
    public string[] Value { get; private set; }

    private FilterQuery(string field, string @operator, params string[] value)
    {
        Field = field;
        Operator = @operator;
        Value = value;
    }

    public override string ToString()
    {
        return $"filter_query[{Field}][{Operator}]={string.Join(",", Value)}";
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

    public LogicalFilterQuery AndBy(FilterQuery query)
    {
        return new LogicalFilterQuery(this).AndBy(query);
    }

    public LogicalFilterQuery OrBy(FilterQuery query)
    {
        return new LogicalFilterQuery(this).OrBy(query);
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
}

public class LogicalFilterQuery
    : IFilterQuery
{
    private List<Tuple<string, FilterQuery>> queries = new();

    public LogicalFilterQuery(FilterQuery query)
    {
        // Queries are AND by default
        queries.Add(Tuple.Create(LogicalOperatorType.And, query));
    }

    public LogicalFilterQuery AndBy(FilterQuery query)
    {
        queries.Add(Tuple.Create(LogicalOperatorType.And, query));

        return this;
    }

    public LogicalFilterQuery OrBy(FilterQuery query)
    {
        // If the previous query is an AND query, then we need to flip it to an OR query
        (string prevOperator, FilterQuery prevQuery) = queries.Last();

        if(prevOperator == LogicalOperatorType.And)
        {
            queries.RemoveAt(queries.Count - 1);
            queries.Add(Tuple.Create(LogicalOperatorType.Or, prevQuery));
        }

        queries.AddRange(Tuple.Create(LogicalOperatorType.Or, query));

        return this;
    }

    public override string ToString()
    {
        var filterQuery = new List<string>();

        foreach((string @operator, FilterQuery query) in queries)
        {
            if (@operator == LogicalOperatorType.Or)
            {
                filterQuery.Add($"filter_query[__or][][{query.Field}][{query.Operator}]={string.Join(",", query.Value)}");
            }
            else
            {
                filterQuery.Add($"filter_query[{query.Field}][{query.Operator}]={string.Join(",", query.Value)}");
            }
        }

        return string.Join("&", filterQuery);
    }

    private static class LogicalOperatorType
    {
        public const string And = "and";
        public const string Or = "or";
    }
}
