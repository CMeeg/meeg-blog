<template>
  <layout>
    <h1>{{ pageNode.title }}</h1>

    <rich-text :html="pageNode.summary" />

    <node-list :nodes="pageNode.articlesInSeries">
      <article-summary slot="node" slot-scope="{ node }" :article="node" />
    </node-list>
  </layout>
</template>

<page-query>
query ArticleSeries ($id: String!) {
  articleSeries (id: $id) {
    title,
    summary,
    articlesInSeries {
      title,
      summary,
      tag {
        id,
        name
      },
      path,
      date,
      lastUpdated
    },
    path,
    pageMetadataMetaTitle,
    pageMetadataMetaDescription,
    pageMetadataOpenGraphTitle,
    pageMetadataOpenGraphDescription,
    pageMetadataOpenGraphImage {
      url,
      description
    }
  }
}
</page-query>

<script>
import RichText from '~/components/RichText.vue';
import NodeList from '~/components/NodeList.vue';
import ArticleSummary from '~/components/ArticleSummary.vue';
import metadata from '~/mixins/Metadata';

export default {
  components: {
    RichText,
    NodeList,
    ArticleSummary
  },
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
