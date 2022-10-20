import type { AssetStoryblok } from '@features/storyblok/types/components'
import { getImageAssetUrl } from '@features/storyblok/url'

export interface Props {
  asset: AssetStoryblok
}

export default function Image({ asset }: Props) {
  const src = getImageAssetUrl(asset)

  const { alt, title } = asset

  // TODO: Use some responsive image component
  return <img src={src} alt={alt} title={title} />
}
