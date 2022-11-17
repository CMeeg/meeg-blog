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

const addFingerprintToUrl = (fingerprint: string, url: string) => {
  if (import.meta.env.DEV) {
    return url
  }

  const urlMatch = url.match(/^\/(.*)\.(.*)/)

  if (!urlMatch || urlMatch.length !== 3) {
    return url
  }

  const path = urlMatch[1]
  const ext = urlMatch[2]

  return `/${path}.v${fingerprint}.${ext}`
}

const fingerprintUrl = (url: string) => {
  if (!import.meta.env.PUBLIC_BUILD_ID) {
    return url
  }

  const commit = import.meta.env.PUBLIC_BUILD_ID

  return addFingerprintToUrl(commit.substring(0, 8), url)
}

export { getRelativeUrl, getAbsoluteUrl, fingerprintUrl, addFingerprintToUrl }
