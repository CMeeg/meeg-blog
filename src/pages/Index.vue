<template>
  <layout>
    <h1>{{ pageNode.title }}</h1>

    <div v-html="pageNode.summary" />

    <ul>
      <li v-for="article in $page.latestArticles.edges" :key="article.node.id">
        <g-link :to="article.node.path">{{ article.node.title }}</g-link>
      </li>
    </ul>
    <Pager :info="$page.latestArticles.pageInfo" />
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
        pageMetadataMetaDescription
      }
    }
  }
  latestArticles: allArticle(perPage: 10, page: $page) @paginate {
    pageInfo {
      totalPages,
      currentPage
    }
    edges {
      node {
        id,
        title,
        author {
          name
        },
        summary,
        path
        # articleTopics,
        # date,
        # lastUpdated
      }
    }
  }
}
</page-query>

<script>
import metadata from '~/mixins/Metadata';
import { Pager } from 'gridsome';

export default {
  components: {
    Pager
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return this.$page.home.edges[0].node;
    }
  }
};
</script>
