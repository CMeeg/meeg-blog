<template>
  <div>
    <page-intro :title="pageNode.title" />

    <article-summary-list :articles="$page.latestArticles" />
  </div>
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
import PageIntro from '@/components/PageIntro.vue';
import ArticleSummaryList from '@/components/articles/ArticleSummaryList.vue';
import metadata from '@/mixins/Metadata';

export default {
  components: {
    PageIntro,
    ArticleSummaryList
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return {
        title: 'Articles',
        url: '/articles/'
      }
    }
  }
};
</script>
