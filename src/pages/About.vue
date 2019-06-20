<template>
  <Layout>
      <h1>{{ aboutPage.name }}</h1>

      <div v-html="aboutPage.bio" />
  </Layout>
</template>

<page-query>
query Author {
  author: allAuthor(filter: { codename: { eq: "chris_meagher" }}, limit: 1) {
    edges {
      node {
        id,
        name,
        bio,
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
      title: this.aboutPage.metaTitle || 'About',
      description: this.aboutPage.metaDescription || ''
    }
  },
  computed: {
    aboutPage: function() {
      return this.$page.author.edges[0].node;
    }
  }
}
</script>
