<template>
  <layout :title="pageNode.title">
    <rich-text :html="pageNode.body" />
  </layout>
</template>

<page-query>
query Article ($id: String!) {
  article (id: $id) {
    title,
    body,
    path,
    pageMetadataMetaTitle,
    pageMetadataMetaDescription,
    pageMetadataOpenGraphTitle,
    pageMetadataOpenGraphDescription,
    pageMetadataOpenGraphImage {
      url
    }
  }
}
</page-query>

<script>
import appConfig from '~/app.config.js';
import metadata from '~/mixins/Metadata';
import RichText from '~/components/RichText.vue';

export default {
  components: {
    RichText
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return this.$page.article;
    }
  },
  methods: {
    getPageMetaInfo: function() {
      const node = this.pageNode;
      const metaInfo = {};

      this.addArticleMetaInfo(metaInfo, node);

      return metaInfo;
    },
    addArticleMetaInfo: function(metaInfo, node) {
      metaInfo.htmlAttrs = {
        prefix: 'article: http://ogp.me/ns/article#'
      };

      this.addMetaItems(metaInfo, [
        { name: 'og:type', content: 'article' },
        { name: 'article:author', content: appConfig.getSiteUrl('/about') }
      ]);

      /*
      TODO: Add these optional article props, if possible (and relevant)
      Namespace can be added using prefix="article: http://ogp.me/ns/article#" (see https://gridsome.org/docs/body-html-attributes#change-attributes-per-page)
      datetime is https://en.wikipedia.org/wiki/ISO_8601
      article - Namespace URI: http://ogp.me/ns/article#
      article:published_time - datetime - When the article was first published.
      article:modified_time - datetime - When the article was last changed.
      article:expiration_time - datetime - When the article is out of date after.
      article:author - profile array - Writers of the article.
      article:section - string - A high-level section name. E.g. Technology
      article:tag - string array - Tag words associated with this article.
      */
    }
  }
}
</script>
