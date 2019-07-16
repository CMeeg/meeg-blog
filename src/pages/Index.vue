<template>
  <Layout>
    <h1>{{ homePage.title }}</h1>

    <div v-html="homePage.summary" />

    <ul>
      <li v-for="article in $page.latestArticles.edges" :key="article.node.id">
        <g-link :to="article.node.path">{{ article.node.title }}</g-link>
      </li>
    </ul>
    <Pager :info="$page.latestArticles.pageInfo" />
  </Layout>
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
      totalPages
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
import { Pager } from 'gridsome';

export default {
  components: {
    Pager
  },
  metaInfo() {
    return {
      title: this.homePage.pageMetadataMetaTitle || 'Home',
      description: this.homePage.pageMetadataMetaDescription || ''
    };
  },
  computed: {
    homePage() {
      return this.$page.home.edges[0].node;
    }
  }
};
</script>
