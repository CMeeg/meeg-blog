import type { AssetStoryblok, MultilinkStoryblok } from '../types/components'

type StoryblokRichText = {
  type: 'doc'
  content: StoryblokRichTextBlock[]
}

type StoryblokRichTextBlock = {
  type: StoryblokRichTextBlockType | typeof textType
  attrs?: StoryblokRichTextBlockAttributes
  marks?: StoryblokRichTextMark[]
  text?: string
  content: StoryblokRichTextBlock[]
}

type StoryblokRichTextBlockAttributes = {
  level?: number
  class?: string
  src?: string
  alt?: string
  title?: string
  order?: number
  body?: Array<{
    _uid: string
  }>
}

type StoryblokRichTextMark = {
  type: StoryblokRichTextMarkType
  attrs?: StoryblokRichTextMarkAttributes
}

type StoryblokRichTextMarkAttributes = {
  linktype?: string
  href?: string
  target?: string
  anchor?: string
  uuid?: string
  class?: string
}

const enum StoryblokRichTextBlockType {
  Heading = 'heading',
  CodeBlock = 'code_block',
  Paragraph = 'paragraph',
  Blockquote = 'blockquote',
  OrderedList = 'ordered_list',
  BulletList = 'bullet_list',
  ListItem = 'list_item',
  HorizontalRule = 'horizontal_rule',
  HardBreak = 'hard_break',
  Image = 'image',
  Blok = 'blok'
}

const enum StoryblokRichTextMarkType {
  Bold = 'bold',
  Italic = 'italic',
  Strike = 'strike',
  Underline = 'underline',
  Code = 'code',
  Link = 'link',
  Styled = 'styled'
}

const textType = 'text'

const isTextBlock = (block: StoryblokRichTextBlock) => {
  return block.type === textType
}

const getLinkUrl = (link: MultilinkStoryblok): string | null => {
  if ((link.linktype ?? '') === 'email') {
    if (link.email) {
      return `mailto:${link.email}`
    } else {
      return null
    }
  }

  const { cached_url } = link

  if (!cached_url) {
    return null
  }

  const url = cached_url as string

  if (url.startsWith('/')) {
    return url
  }

  return `/${url}`
}

const getImageUrl = (asset: AssetStoryblok) => {
  // TODO: Check this asset is an image

  const { filename } = asset
  const imageBaseUrl = 'https://img2.storyblok.com'
  const filepath = filename.replace('https://a.storyblok.com/', '')

  // TODO: Deal with Storyblok image options
  // return `${imageBaseUrl}/${this.options}/${path}`

  return `${imageBaseUrl}/${filepath}`
}

export {
  isTextBlock,
  getLinkUrl,
  getImageUrl,
  StoryblokRichTextBlockType,
  StoryblokRichTextMarkType
}

export type { StoryblokRichText, StoryblokRichTextBlock }
