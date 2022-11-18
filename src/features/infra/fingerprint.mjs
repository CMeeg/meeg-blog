const addFingerprintToUrl = (fingerprint, url) => {
  if (import.meta?.env?.NODE_ENV === 'development') {
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

const fingerprintUrl = (url, hash) => {
  const buildHash = hash ?? import.meta.env.PUBLIC_BUILD_ID

  if (!buildHash) {
    return url
  }

  return addFingerprintToUrl(buildHash.substring(0, 8), url)
}

export { fingerprintUrl, addFingerprintToUrl }
