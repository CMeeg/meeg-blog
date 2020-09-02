const getGlobalMetadata = function (context) {
  const global = context.store.state.global
  const globalMetadata = trimObject(global.metadata)

  /* eslint-disable camelcase */
  return {
    site_title: global.site_title,
    twitter_site: global.twitter_username,
    ...globalMetadata
  }
  /* eslint-enable camelcase */
}

const getOpenGraphPrefix = function (metadata) {
  const prefixes = ['og: http://ogp.me/ns#']

  if (metadata.article) {
    prefixes.push('article: http://ogp.me/ns/article#')
  }

  if (metadata.profile) {
    prefixes.push('profile: http://ogp.me/ns/profile#')
  }

  return prefixes.join(' ')
}

const getOpenGraphType = function (metadata) {
  if (metadata.article) {
    return 'article'
  }

  return 'website'
}

const getAbsoluteUrl = function (baseUrl, path) {
  if (!path) {
    return baseUrl
  }

  if (path.startsWith('/')) {
    path = path.slice(1)
  }

  return `${baseUrl}/${path}`
}

const mergeMetadata = function (context, globalMetadata, pageMetadata) {
  const mergedMetadata = Object.assign({}, globalMetadata, pageMetadata)

  /* eslint-disable camelcase */
  if (!mergedMetadata.og_type) {
    mergedMetadata.og_type = getOpenGraphType(mergedMetadata)
  }

  if (!mergedMetadata.og_url) {
    mergedMetadata.og_url = getAbsoluteUrl(
      context.$config.baseUrl,
      context.route.path
    )
  }

  if (!mergedMetadata.lang) {
    mergedMetadata.lang = 'en-GB'
  }

  if (!mergedMetadata.prefix) {
    mergedMetadata.prefix = getOpenGraphPrefix(mergedMetadata)
  }

  if (!mergedMetadata.og_title) {
    mergedMetadata.og_title = mergedMetadata.title
  }

  if (!mergedMetadata.og_description) {
    mergedMetadata.og_description = mergedMetadata.description
  }

  if (!mergedMetadata.twitter_url) {
    mergedMetadata.twitter_url = mergedMetadata.og_url
  }

  if (!mergedMetadata.twitter_title) {
    mergedMetadata.twitter_title = mergedMetadata.og_title
  }

  if (!mergedMetadata.twitter_description) {
    mergedMetadata.twitter_description = mergedMetadata.og_description
  }

  if (!mergedMetadata.twitter_image) {
    mergedMetadata.twitter_image = mergedMetadata.og_image
  }
  /* eslint-enable camelcase */

  return mergedMetadata
}

const trimObject = function (object) {
  const trimmedObject = Object.assign({}, object)

  // Remove empty keys
  Object.keys(trimmedObject).forEach(
    (key) => !trimmedObject[key] && delete trimmedObject[key]
  )

  return trimmedObject
}

const getHtmlAttributes = function (metadata) {
  return {
    prefix: metadata.prefix,
    lang: metadata.lang.toLowerCase()
  }
}

const getMeta = function (context, metadata) {
  const meta = [
    {
      hid: 'description',
      name: 'description',
      content: metadata.description
    }
  ]

  addOpenGraphMeta(context, meta, metadata)

  addTwitterMeta(meta, metadata)

  return meta
}

const addOpenGraphMeta = function (context, meta, metadata) {
  meta.push(
    {
      hid: 'og:type',
      property: 'og:type',
      content: metadata.og_type
    },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: metadata.site_title
    },
    {
      hid: 'og:locale',
      property: 'og:locale',
      content: metadata.lang.replace('-', '_')
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: metadata.og_url
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: metadata.og_title,
      template: (chunk) => chunk || metadata.site_title
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: metadata.og_description
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: metadata.og_image
    }
  )

  if (metadata.article) {
    addOpenGraphArticleMeta(context, meta, metadata.article)
  }

  if (metadata.profile) {
    addOpenGraphProfileMeta(meta, metadata.profile)
  }
}

const addOpenGraphArticleMeta = function (context, meta, article) {
  meta.push(
    {
      hid: 'article:published_time',
      property: 'article:published_time',
      content: article.published_time.toISOString()
    },
    {
      hid: 'article:author',
      property: 'article:author',
      content: getAbsoluteUrl(context.$config.baseUrl, article.author)
    },
    {
      hid: 'article:section',
      property: 'article:section',
      content: article.section
    }
  )

  if (article.tags && article.tags.length > 0) {
    article.tags.forEach((tag, index) => {
      meta.push({
        hid: `article:tag:${index}`,
        property: 'article:tag',
        content: tag
      })
    })
  }
}

const addOpenGraphProfileMeta = function (meta, profile) {
  meta.push(
    {
      hid: 'profile:first_name',
      property: 'profile:first_name',
      content: profile.first_name
    },
    {
      hid: 'profile:last_name',
      property: 'profile:last_name',
      content: profile.last_name
    }
  )
}

const addTwitterMeta = function (meta, metadata) {
  meta.push(
    {
      hid: 'twitter:card',
      property: 'twitter:card',
      content: 'summary'
    },
    {
      hid: 'twitter:site',
      property: 'twitter:site',
      content: `@${metadata.twitter_site}`
    },
    {
      hid: 'twitter:url',
      property: 'twitter:url',
      content: metadata.twitter_url
    },
    {
      hid: 'twitter:title',
      property: 'twitter:title',
      content: metadata.twitter_title,
      template: (chunk) => chunk || metadata.site_title
    },
    {
      hid: 'twitter:description',
      property: 'twitter:description',
      content: metadata.twitter_description
    },
    {
      hid: 'twitter:image',
      property: 'twitter:image',
      content: metadata.twitter_image
    }
  )
}

const metadata = function (context) {
  return {
    getMetadata: (metadata) => {
      const globalMetadata = getGlobalMetadata(context)
      const pageMetadata = trimObject(metadata || {})
      const mergedMetadata = mergeMetadata(
        context,
        globalMetadata,
        pageMetadata
      )

      return {
        htmlAttrs: getHtmlAttributes(mergedMetadata),
        title: mergedMetadata.title,
        titleTemplate: (chunk) => {
          return chunk
            ? `${chunk} | ${mergedMetadata.site_title}`
            : mergedMetadata.site_title
        },
        meta: getMeta(context, mergedMetadata)
      }
    }
  }
}

export default ({ app }, inject) => {
  inject('metadata', () => metadata(app.context))
}
