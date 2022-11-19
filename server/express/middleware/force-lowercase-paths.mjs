import url from 'node:url'

const assetExtensions = new RegExp('css|jpg|jpeg|js|png|svg|woff|woff2')

const isAssetPath = (path) => {
  if (!path || path.indexOf('.') < 0) {
    // No file extension in path

    return false
  }

  const extension = path.split('.').pop()

  return assetExtensions.test(extension)
}

const forceLowercasePaths = (req, res, next) => {
  const { path } = req

  if (path.toLowerCase() === path) {
    // Already lowercase

    next()
  } else if (isAssetPath(path)) {
    // We don't want to redirect requests for assets

    next()
  } else {
    const requestUrl = url.parse(req.originalUrl)

    const lowerPathname = requestUrl.pathname?.toLowerCase()
    requestUrl.pathname = lowerPathname

    res.redirect(301, url.format(requestUrl))
  }
}

export { forceLowercasePaths }
