// https://kieran.casa/how-i-add-cache-headers-to-static-content-with-express
const setCacheHeaders = async (req, res, next) => {
  const noOp = () => {
    next()
  }

  // const doNotCache = () => {
  //   res.setHeader('Cache-Control', 'no-cache')
  //   next()
  // }

  const cacheIndefinitely = () => {
    // Well, 1 year!
    res.setHeader('Cache-Control', 'public, max-age=31557600')
    next()
  }

  // const cacheForOneDay = () => {
  //   res.setHeader('Cache-Control', 'public, max-age=86400')
  //   next()
  // }

  if (req.method !== 'GET') {
    return noOp()
  }

  switch (true) {
    // Files with cache-busting names
    case !!req.url.match(
      /^\/.*\.v?[a-z0-9]+\.(css|css\.map|gif|jpg|js|js\.map|png|svg|woff|woff2)$/g
    ):
      return cacheIndefinitely()
  }

  return noOp()
}

export { setCacheHeaders }
