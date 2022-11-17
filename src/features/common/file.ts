import callsites from 'callsites'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { addFingerprintToUrl } from './url'

const serverDir = './dist/server'
const clientDir = './dist/client'

const getAppRootPath = () => {
  let entryFilePath = callsites()?.[0]?.getFileName()

  if (!entryFilePath) {
    return null
  }

  if (entryFilePath.startsWith('file:')) {
    entryFilePath = fileURLToPath(entryFilePath)
  }

  const normalisedServerDir = path.normalize(serverDir)
  const normalisedEntryFilePath = path.normalize(entryFilePath)
  const entryDir = path.dirname(normalisedEntryFilePath)

  const serverDirIndex = entryDir.lastIndexOf(normalisedServerDir)

  if (serverDirIndex < 0) {
    return null
  }

  const appRootPath = entryDir.substring(0, serverDirIndex)

  return path.resolve(appRootPath, '.')
}

const getClientFilePath = (fileUrl: string) => {
  const appRootPath = getAppRootPath()

  if (!appRootPath) {
    return null
  }

  return path.join(appRootPath, clientDir, fileUrl)
}

const createHash = (filePath: string) => {
  // TODO: Cache this
  const buffer = fs.readFileSync(filePath)
  const sum = crypto.createHash('sha256')
  sum.update(buffer)
  return sum.digest('hex')
}

const fingerprint = (fileUrl: string, fingerprint?: string) => {
  if (import.meta.env.DEV) {
    // Don't fingerprint in dev mode

    return fileUrl
  }

  if (fingerprint) {
    return addFingerprintToUrl(fingerprint, fileUrl)
  }

  const filePath = getClientFilePath(fileUrl)

  if (!filePath) {
    return fileUrl
  }

  try {
    const fileHash = createHash(filePath)

    return addFingerprintToUrl(fileHash.substring(0, 8), fileUrl)
  } catch (err) {
    // TODO: Maybe log this
    console.error(err)
  }

  return fileUrl
}

export { fingerprint }
