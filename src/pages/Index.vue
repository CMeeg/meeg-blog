<template>
  <layout>
    <h1>{{ pageNode.title }}</h1>

    <rich-text :html="pageNode.summary" />

    <node-list :nodes="$page.latestArticles" :pager-options="{ prevLabel: 'See newer articles', nextLabel: 'See older articles' }">
      <article-summary slot="node" slot-scope="{ node }" :article="node" />
    </node-list>
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
      const node = this.$page.home.edges[0].node;

      node.url = '/';

      return node;
    }
  }
};
</script>
