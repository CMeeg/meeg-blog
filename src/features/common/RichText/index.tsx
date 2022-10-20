import type { StoryblokRichtext } from 'storyblok-rich-text-react-renderer'
import { render } from 'storyblok-rich-text-react-renderer'

export interface Props {
  document: StoryblokRichtext
}

export default function RichText({ document }: Props) {
  // document is the rich text object you receive from Storyblok,
  // in the form { type: "doc", content: [ ... ] }
  return <div>{render(document)}</div>
}
