<template>
  <Layout>
      <h1>{{ homePage.title }}</h1>

      <div v-html="homePage.summary" />
  </Layout>
</template>

<page-query>
query Home {
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
}
</page-query>

<script>
export default {
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
