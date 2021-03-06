import Vue from 'vue'

Vue.filter('dashify', function (value, prefix) {
  if (typeof value === 'undefined') {
    return 'undefined'
  }

  const dashified = value
    .toString()
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .replace(/[ _]/g, '-')

  if (typeof prefix === 'undefined') {
    prefix = 'blok'
  }

  return `${prefix}-${dashified}`
})

Vue.filter('rootRelative', function (url) {
  if (url.startsWith('/')) {
    return url
  }

  return `/${url}`
})
