const metadata = function(context) {
  return {
    getMetadata: metadata => {
      const global = context.store.state.global
      const globalMetadata = {
        site_title: global.site_title,
        og_type: 'website',
        og_url: `${context.env.BASE_URL}${context.route.path}`,
        twitter_site: global.twitter_username,
        lang: 'en-GB',
        ...global.metadata
      }
      const pageMetadata = metadata || {}

      // Remove empty keys
      Object.keys(pageMetadata).forEach(
        key => !pageMetadata[key] && delete pageMetadata[key]
      )

      const mergedMetadata = Object.assign({}, globalMetadata, pageMetadata)

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

      return {
        htmlAttrs: {
          prefix: 'og: http://ogp.me/ns#',
          lang: mergedMetadata.lang.toLowerCase()
        },
        title: mergedMetadata.title,
        titleTemplate: chunk => {
          return chunk
            ? `${chunk} | ${mergedMetadata.site_title}`
            : mergedMetadata.site_title
        },
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: mergedMetadata.description
          },
          {
            hid: 'og:type',
            property: 'og:type',
            content: mergedMetadata.og_type
          },
          {
            hid: 'og:site_name',
            property: 'og:site_name',
            content: mergedMetadata.site_title
          },
          {
            hid: 'og:locale',
            property: 'og:locale',
            content: mergedMetadata.lang.replace('-', '_')
          },
          {
            hid: 'og:url',
            property: 'og:url',
            content: mergedMetadata.og_url
          },
          {
            hid: 'og:title',
            property: 'og:title',
            content: mergedMetadata.og_title,
            template: chunk => chunk || mergedMetadata.site_title
          },
          {
            hid: 'og:description',
            property: 'og:description',
            content: mergedMetadata.og_description
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: mergedMetadata.og_image
          },
          {
            hid: 'twitter:card',
            property: 'twitter:card',
            content: 'summary'
          },
          {
            hid: 'twitter:site',
            property: 'twitter:site',
            content: `@${mergedMetadata.twitter_site}`
          },
          {
            hid: 'twitter:url',
            property: 'twitter:url',
            content: mergedMetadata.twitter_url
          },
          {
            hid: 'twitter:title',
            property: 'twitter:title',
            content: mergedMetadata.twitter_title,
            template: chunk => chunk || mergedMetadata.site_title
          },
          {
            hid: 'twitter:description',
            property: 'twitter:description',
            content: mergedMetadata.twitter_description
          },
          {
            hid: 'twitter:image',
            property: 'twitter:image',
            content: mergedMetadata.twitter_image
          }
        ]
      }
    }
  }
}

export default ({ app }, inject) => {
  inject('metadata', () => metadata(app.context))
}
