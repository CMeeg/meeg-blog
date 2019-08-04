<template>
  <layout>
    <h1>{{ pageNode.title }}</h1>

    <article-summary-list :articles="$page.latestArticles" />
  </layout>
</template>

<page-query>
query Articles($page: Int) {
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
import ArticleSummaryList from '~/components/ArticleSummaryList.vue';
import metadata from '~/mixins/Metadata';

export default {
  components: {
    ArticleSummaryList
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return {
        title: 'Articles',
        url: '/articles'
      }
    }
  }
};
</script>
