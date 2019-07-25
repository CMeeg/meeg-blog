<template>
  <layout :title="pageNode.title">
    <rich-text :html="pageNode.body" />
  </layout>
</template>

<page-query>
query Article ($id: String!) {
  article (id: $id) {
    title,
    body,
    pageMetadataMetaTitle,
    pageMetadataMetaDescription
  }
}
</page-query>

<script>
import metadata from '~/mixins/Metadata';
import RichText from '~/components/RichText.vue';

export default {
  components: {
    RichText
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return this.$page.article;
    }
  }
}
</script>
