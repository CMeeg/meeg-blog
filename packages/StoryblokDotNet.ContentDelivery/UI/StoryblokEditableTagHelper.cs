using Microsoft.AspNetCore.Razor.TagHelpers;
using StoryblokDotNet.ContentDelivery.Stories;

namespace StoryblokDotNet.ContentDelivery.UI;

[HtmlTargetElement(Attributes = EditableAttributeName)]
public class StoryblokEditableTagHelper
    : TagHelper
{
    private const string EditableAttributeName = "storyblok-editable";

    [HtmlAttributeName(EditableAttributeName)]
    public string? Editable { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.Attributes.RemoveAll(EditableAttributeName);

        if (!StoryBlockEditable.TryParse(Editable, out StoryBlockEditable? editable))
        {
            return;
        }

        output.Attributes.SetAttribute("data-blok-c", editable.ToJson());
        output.Attributes.SetAttribute("data-blok-uid", editable.EditorUid);
    }
}
