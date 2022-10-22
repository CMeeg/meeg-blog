import type { Image } from '@features/common/media'

export interface Props {
  image: Image
}

export default function Image({ image }: Props) {
  const { src, alt, title } = image

  // TODO: Use some responsive image component
  return <img src={src} alt={alt} title={title} />
}
