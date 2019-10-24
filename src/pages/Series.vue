<template>
  <div>
    <page-intro :title="pageNode.title" />

    <node-list :nodes="$page.latestSeries" :pager-options="{ prevLabel: 'See newer series', nextLabel: 'See older series' }">
      <article-series-summary slot="node" slot-scope="{ node }" :series="node" />
    </node-list>
  </div>
</template>

<page-query>
query Series($page: Int) {
  latestSeries: allArticleSeries(sortBy: "sortDate", perPage: 10, page: $page) @paginate {
    pageInfo {
      totalPages,
      currentPage
    },
    edges {
      node {
        title,
        summary,
        articlesInSeries {
          id,
          title,
          path
        },
        path,
        lastUpdated
      }
    }
  }
}
</page-query>

<script>
import PageIntro from '@/components/PageIntro.vue';
import NodeList from '@/components/NodeList.vue';
import ArticleSeriesSummary from '@/components/article-series/ArticleSeriesSummary.vue';
import metadata from '@/mixins/Metadata';

export default {
  components: {
    PageIntro,
    NodeList,
    ArticleSeriesSummary
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return {
        title: 'Article Series',
        url: '/series/'
      }
    }
  }
};
</script>
