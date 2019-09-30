<template>
  <layout>
    <h1>{{ pageNode.title }}</h1>

    <p>Updated <time :datetime="pageNode.lastUpdated">{{ pageNode.lastUpdated }}</time></p>

    <rich-text :html="pageNode.summary" />

    <article-summary-list :articles="articles" />
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
        name,
        path
      },
      path,
      date,
      lastUpdated
    },
    path,
    lastUpdated,
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
import RichText from '~/components/kontent/RichText.vue';
import ArticleSummaryList from '~/components/articles/ArticleSummaryList.vue';
import metadata from '~/mixins/Metadata';

export default {
  components: {
    RichText,
    ArticleSummaryList
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return this.$page.articleSeries;
    },
    articles: function() {
      return {
        edges: this.pageNode.articlesInSeries.map(article => {
          return {
            node: article
          };
        })
      };
    }
  }
}
</script>
