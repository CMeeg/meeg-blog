<template>
  <layout :title="$page.articleSeries.title">
    <p>TODO</p>
  </layout>
</template>

<page-query>
query ArticleSeries ($id: String!) {
  articleSeries (id: $id) {
    title
    pageMetadataMetaTitle
  }
}
</page-query>

<script>
export default {
  metaInfo: function() {
    return {
      title: this.$page.articleSeries.pageMetadataMetaTitle
    }
  }
}
</script>
