<template>
  <Layout>
      <h1>{{ homePage.title }}</h1>

      <div v-html="homePage.summary" />

      <ul>
        <li v-for="article in $page.latestArticles.edges" :key="article.node.id">
          <g-link :to="`article/${article.node.slug}`">{{ article.node.title }}</g-link>
        </li>
      </ul>
      <Pager :info="$page.latestArticles.pageInfo"/>
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
        metaTitle,
        metaDescription
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
        author,
        summary,
        slug
        # articleTopics,
        # date,
        # lastUpdated
      }
    }
  }
}
</page-query>

<script>
import { Pager } from 'gridsome'

export default {
  components: {
    Pager
  },
  metaInfo () {
    return {
      title: this.homePage.metaTitle || 'Home',
      description: this.homePage.metaDescription || ''
    }
  },
  computed: {
    homePage: function() {
      return this.$page.home.edges[0].node;
    }
  }
}
</script>
