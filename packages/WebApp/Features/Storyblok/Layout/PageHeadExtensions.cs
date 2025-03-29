using WebApp.Features.Pages.Layout;
using WebApp.Features.Storyblok.Blocks;
using WebApp.Features.Storyblok.Plugins;

namespace WebApp.Features.Storyblok.Layout;

public static class MetadataExtensions
{
    private const string DefaultSiteTitle = "Chris Meagher's blog";

    public static PageHead MergeWith(this PageHead pageHead, GlobalBlock? global)
    {
        SeoMetadataPlugin? globalMetadata = global?.Metadata;

        if (global == null || globalMetadata == null)
        {
            return pageHead;
        }

        string siteTitle = global.SiteTitle.Coalesce(DefaultSiteTitle);

        pageHead.Metadata.Title = siteTitle;
        pageHead.Metadata.TitleTemplate = "{0} | " + siteTitle;

        pageHead.MergeWith(globalMetadata);

        if (pageHead.OpenGraph != null)
        {
            pageHead.OpenGraph.SiteName = siteTitle;
        }

        return pageHead;
    }

    public static PageHead MergeWith(this PageHead pageHead, SeoMetadataPlugin? seoMetadata)
    {
        if (seoMetadata == null)
        {
            return pageHead;
        }

        pageHead.Metadata.Title = seoMetadata.Title.Coalesce(pageHead.Metadata.Title);
        pageHead.Metadata.Description = seoMetadata.Description.Coalesce(pageHead.Metadata.Description);

        MergeOpenGraph(pageHead, seoMetadata);

        return pageHead;
    }

    private static void MergeOpenGraph(PageHead pageHead, SeoMetadataPlugin seoMetadata)
    {
        string title = seoMetadata.OgTitle
            .Coalesce(pageHead.OpenGraph?.Title)
            .Coalesce(pageHead.Metadata.Title);
        string image = seoMetadata.OgImage
            .Coalesce(pageHead.OpenGraph?.Image);
        string url = pageHead.Metadata.CanonicalUrl
            .EmptyIfNull();

        if (pageHead.OpenGraph == null)
        {
            if (string.IsNullOrEmpty(title)
                || string.IsNullOrEmpty(image)
                || string.IsNullOrEmpty(url))
            {
                return;
            }

            pageHead.OpenGraph = new OpenGraphMetadata
            {
                Title = title,
                Image = image,
                Url = url
            };
        }
        else
        {
            pageHead.OpenGraph.Title = title;
            pageHead.OpenGraph.Image = image;
            pageHead.OpenGraph.Url = url;
        }

        pageHead.OpenGraph.Description = seoMetadata.OgDescription
            .Coalesce(pageHead.OpenGraph.Description)
            .Coalesce(pageHead.Metadata.Description);
    }
}
