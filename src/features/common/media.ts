import type { AssetStoryblok } from '@features/storyblok/types/components'

interface Image {
  src: string
  alt?: string
  title?: string
}

interface ImageServiceOptions {
  resize?: {
    width?: number
    height?: number
  }
  quality?: number
}

const applyImageServiceOptions = (
  url: string,
  options: ImageServiceOptions
) => {
  const params: string[] = []

  if (options.resize) {
    const width =
      options.resize.width && options.resize.width >= 0
        ? options.resize.width
        : 0

    const height =
      options.resize.height && options.resize.height >= 0
        ? options.resize.height
        : 0

    if (width > 0 || height > 0) {
      params.push(`${width}x${height}`)
    }
  }

  if (options.quality && options.quality >= 0) {
    params.push(`filters:quality(${options.quality})`)
  }

  if (params.length) {
    return `${url}/m/${params.join('/')}`
  }

  return url
}

const getImageFromAsset = (
  asset: AssetStoryblok,
  options?: ImageServiceOptions
) => {
  const { filename: url, alt, title } = asset

  const src = options ? applyImageServiceOptions(url, options) : url

  return {
    src,
    alt,
    title
  }
}

export { getImageFromAsset }

export type { Image }
