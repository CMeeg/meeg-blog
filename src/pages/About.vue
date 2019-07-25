<template>
  <layout>
    <h1>{{ pageNode.name }}</h1>

    <div v-html="pageNode.bio" />
  </layout>
</template>

<page-query>
query Author {
  author: allAuthor(filter: { codename: { eq: "chris_meagher" }}, limit: 1) {
    edges {
      node {
        id,
        name,
        bio,
        pageMetadataMetaTitle,
        pageMetadataMetaDescription
      }
    }
  }
}
</page-query>

<script>
import metadata from '~/mixins/Metadata';

export default {
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      const node = this.$page.author.edges[0].node;

      node.title = node.name;

      return node;
    }
  }
};
</script>
