<template>
  <layout>
    <h1>{{ pageNode.title }}</h1>

    <node-list :nodes="$page.latestSeries" :pager-options="{ prevLabel: 'See newer series', nextLabel: 'See older series' }">
      <article-series-summary slot="node" slot-scope="{ node }" :series="node" />
    </node-list>
  </layout>
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
import NodeList from '~/components/NodeList.vue';
import ArticleSeriesSummary from '~/components/ArticleSeriesSummary.vue';
import metadata from '~/mixins/Metadata';

export default {
  components: {
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
        url: '/series'
      }
    }
  }
};
</script>
