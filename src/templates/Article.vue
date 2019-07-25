<template>
  <layout :title="$page.article.title">
    <rich-text :html="$page.article.body" />
  </layout>
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
import RichText from '~/components/RichText.vue';

export default {
  metaInfo () {
    return {
      title: this.$page.article.pageMetadataMetaTitle
    }
  },
  components: {
    RichText
  }
}
</script>
