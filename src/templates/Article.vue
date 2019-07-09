<template>
  <Layout :title="$page.article.title">
    <v-runtime-template :template="$page.article.body" />
  </Layout>
</template>

<page-query>
query Article ($id: String!) {
  article (id: $id) {
    title
    body
    pageMetadataMetaTitle
  }
}
</page-query>

<script>
export default {
  metaInfo () {
    return {
      title: this.$page.article.pageMetadataMetaTitle
    }
  }
}
</script>