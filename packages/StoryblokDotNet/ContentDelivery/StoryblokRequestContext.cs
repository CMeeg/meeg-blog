using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace StoryblokDotNet.ContentDelivery;

public class StoryblokRequestContext
{
    public StoryblokVisualEditorContext? VisualEditorContext { get; private set; }
    public bool IsVisualEditorRequest => VisualEditorContext != null;

    public StoryblokRequestContext(
        IHttpContextAccessor httpContextAccessor,
        IOptions<StoryblokContentDeliveryOptions> options)
    {
        IQueryCollection? query = httpContextAccessor.HttpContext?.Request.Query;

        if (query != null)
        {
            VisualEditorContext = StoryblokVisualEditorContext.ParseFromQueryString(
                query,
                options.Value.Token);
        }
    }
}

public class StoryblokVisualEditorContext
{
    public int StoryId { get; init; }
    public required string SpaceId { get; init; }
    public long Timestamp { get; init; }
    public required string Token { get; init; }
    public required string Language { get; init; }
    public required string ContentType { get; init; }
    public required string Release { get; init; }

    public static StoryblokVisualEditorContext? ParseFromQueryString(
        IQueryCollection query,
        string previewToken)
    {
        int? storyId = query.Get<int>(StoryblokRequestParamName.StoryId);
        if (!storyId.HasValue)
        {
            return null;
        }

        string? spaceId = query.Get<string>(StoryblokRequestParamName.SpaceId);
        if (string.IsNullOrEmpty(spaceId))
        {
            return null;
        }

        long timestamp = query.Get<long>(StoryblokRequestParamName.Timestamp);
        if (timestamp == default)
        {
            return null;
        }

        string? token = query.Get<string>(StoryblokRequestParamName.Token);
        if (string.IsNullOrEmpty(token))
        {
            return null;
        }

        string? language = query.Get<string>(StoryblokRequestParamName.Language);
        if (string.IsNullOrEmpty(language))
        {
            return null;
        }

        string? contentType = query.Get<string>(StoryblokRequestParamName.ContentType);
        if (string.IsNullOrEmpty(contentType))
        {
            return null;
        }

        string release = query.Get<string>(StoryblokRequestParamName.Release)
            ?? string.Empty;

        var context = new StoryblokVisualEditorContext
        {
            StoryId = storyId.Value,
            SpaceId = spaceId,
            Timestamp = timestamp,
            Token = token,
            Language = language,
            ContentType = contentType,
            Release = release
        };

        return context.IsValid(previewToken) ? context : null;
    }
}

public static class StoryblokVisualEditorContextExtensions
{
    public static bool IsValid(
        this StoryblokVisualEditorContext context,
        string previewToken)
    {
        // See https://www.storyblok.com/faq/how-to-verify-the-preview-query-parameters-of-the-visual-editor

        // Produce the validation string
        string validationString = $"{context.SpaceId}:{previewToken}:{context.Timestamp}";

        // Produce a SHA1 hash of the validation string
#pragma warning disable CA5350 // Do Not Use Weak Cryptographic Algorithms
        byte[] hashBytes = SHA1.HashData(Encoding.UTF8.GetBytes(validationString));
        string validationToken = Convert.ToHexStringLower(hashBytes);
#pragma warning restore CA5350 // Do Not Use Weak Cryptographic Algorithms

        // Compare the validation token with the token provided
        if (context.Token != validationToken)
        {
            return false;
        }

        // Ensure that the timestamp is not older than 1 hour
        long currentTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        return context.Timestamp > currentTimestamp - 3600; // 3600 seconds = 1 hour
    }
}

public static class StoryblokRequestParamName
{
    public const string StoryId = "_storyblok";
    public const string SpaceId = "_storyblok_tk[space_id]";
    public const string Timestamp = "_storyblok_tk[timestamp]";
    public const string Token = "_storyblok_tk[token]";
    public const string Language = "_storyblok_lang";
    public const string ContentType = "_storyblok_c";
    public const string Release = "_storyblok_release";
}
