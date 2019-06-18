<template>
  <Layout :title="$page.article.title">
    <div v-html="$page.article.body" />
  </Layout>
</template>

<page-query>
query Article ($id: String!) {
  article (id: $id) {
    title
    body
    metaTitle
  }
}
</page-query>

<script>
export default {
  metaInfo () {
    return {
      title: this.$page.article.metaTitle
    }
  }
}
</script>