<template>
  <Layout :title="$page.articleSeries.title">
      
  </Layout>
</template>

<page-query>
query ArticleSeries ($id: String!) {
  articleSeries (id: $id) {
    title
    metaTitle
  }
}
</page-query>

<script>
export default {
  metaInfo () {
    return {
      title: this.$page.articleSeries.metaTitle
    }
  }
}
</script>