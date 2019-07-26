<template>
  <layout :title="pageNode.title">
    <p>TODO</p>
  </layout>
</template>

<page-query>
query ArticleSeries ($id: String!) {
  articleSeries (id: $id) {
    title,
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
import metadata from '~/mixins/Metadata';

export default {
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return this.$page.articleSeries;
    }
  }
}
</script>
