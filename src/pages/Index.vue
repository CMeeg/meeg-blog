<template>
  <Layout>
    <div v-for="edge in $page.home.edges" :key="edge.node.id">
      <h1>{{ edge.node.title }}</h1>

      <div v-html="edge.node.summary" />
    </div>   
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
      title: this.$page.home.edges[0].node.metaTitle || 'Home',
      description: this.$page.home.edges[0].node.metaDescription || ''
    }
  }
}
</script>
