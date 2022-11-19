import type { Image } from '~/features/common/media'

export interface Props {
  image: Image
  width?: number
  height?: number
  className?: string
}

export default function Image({ image, width, height, className }: Props) {
  const { src, alt, title } = image

  // TODO: Use some responsive image component
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={className}
    />
  )
}
