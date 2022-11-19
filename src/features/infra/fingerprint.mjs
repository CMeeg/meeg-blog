import { getAppEnv } from './env.mjs'

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
  const fingerprintHash = hash ? hash : getAppEnv().build.hash

  if (!fingerprintHash) {
    return url
  }

  return addFingerprintToUrl(fingerprintHash, url)
}

export { fingerprintUrl, addFingerprintToUrl }
