<template>
  <layout>
    <h1>{{ pageNode.title }}</h1>

    <rich-text :html="pageNode.summary" />

    <article-summary-list :articles="$page.latestArticles" />
  </layout>
</template>

<page-query>
query Home($page: Int) {
  home: allLandingPage(filter: { codename: { eq: "home" }}, limit: 1) {
    edges {
      node {
        id,
        title,
        summary,
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
  }
  latestArticles: allArticle(sortBy: "sortDate", perPage: 10, page: $page) @paginate {
    pageInfo {
      totalPages,
      currentPage
    },
    edges {
      node {
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
      }
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
      const node = this.$page.home.edges[0].node;

      node.url = '/';

      return node;
    }
  }
};
</script>
