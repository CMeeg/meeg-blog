import { StoryblokRichText, type StoryblokRichTextProps } from "@storyblok/react"

interface RichTextFieldProps {
  doc: StoryblokRichTextProps['doc']
}

function RichTextField({ doc }: RichTextFieldProps) {
  return <StoryblokRichText doc={doc} />
}

export { RichTextField }
