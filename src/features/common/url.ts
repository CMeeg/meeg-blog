import isAbsoluteUrl from 'is-absolute-url'

const getRelativeUrl = (
  url: string | null,
  basePath = '/'
): string | undefined => {
  if (!url) {
    return undefined
  }

  if (isAbsoluteUrl(url)) {
    return url
  }

  if (url === basePath) {
    return url
  }

  const path = url.endsWith('/') ? url.slice(0, -1) : url

  if (path.startsWith(basePath)) {
    return path
  }

  return `${basePath}${path}`
}

const getAbsoluteUrl = (url: string, baseUrl: string) => {
  if (isAbsoluteUrl(url)) {
    return url
  }

  return new URL(url, baseUrl).toString()
}

export { getRelativeUrl, getAbsoluteUrl }
