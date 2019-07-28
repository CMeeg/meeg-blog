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
    publishedDate,
    lastUpdated,
    articleTopics {
      name
    },
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
        { name: 'article:published_time', content: node.publishedDate },
        { name: 'article:modified_time', content: new Date(node.lastUpdated).getTime() === 0 ? null : node.lastUpdated },
        { name: 'article:author', content: appConfig.getSiteUrl('/about') }
      ]);

      for (const tag of node.articleTopics) {
        this.addMetaItem(metaInfo, { name: 'article:tag', content: tag.name });
      }
    }
  }
}
</script>
