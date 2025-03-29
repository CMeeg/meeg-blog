using Microsoft.AspNetCore.Razor.TagHelpers;

namespace WebApp.Features.Pages.Layout;

[HtmlTargetElement("html", Attributes = AttributeName)]
public class HtmlAttributesTagHelper
    : TagHelper
{
    private const string AttributeName = "html-attrs";

    private readonly PageLayoutContext layoutContext;

    public HtmlAttributesTagHelper(PageLayoutContext layoutContext)
    {
        this.layoutContext = layoutContext;
    }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.Attributes.RemoveAll(AttributeName);

        HtmlAttributeCollection htmlAttributes = await layoutContext.UseHtmlAttributesAsync();

        foreach (KeyValuePair<string, object> attribute in htmlAttributes)
        {
            output.Attributes.SetAttribute(attribute.Key, attribute.Value);
        }

        PageHead pageHead = await layoutContext.UseHeadAsync();

        SetOpenGraphAttributes(pageHead.OpenGraph, output);
    }

    private static void SetOpenGraphAttributes(OpenGraphMetadata? openGraph, TagHelperOutput output)
    {
        if (openGraph == null)
        {
            return;
        }

        output.Attributes.SetAttribute("prefix", "og: https://ogp.me/ns#");
    }
}
