<template>
  <div>
    <page-intro :title="pageNode.title" />

    <rich-text :html="pageNode.body" />
  </div>
</template>

<page-query>
query Thanks {
  thanks: allLandingPage(filter: { codename: { eq: "thanks" }}, limit: 1) {
    edges {
      node {
        id,
        title,
        body,
        pageMetadataMetaTitle,
        pageMetadataMetaDescription,
        pageMetadataOpenGraphTitle,
        pageMetadataOpenGraphDescription,
        pageMetadataOpenGraphImage {
          url,
          description
        }
      }
    }
  }
}
</page-query>

<script>
import PageIntro from '@/components/PageIntro.vue';
import RichText from '@/components/kontent/RichText.vue';
import metadata from '@/mixins/Metadata';

export default {
  components: {
    PageIntro,
    RichText
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      const node = this.$page.thanks.edges[0].node;

      node.url = '/thanks/';

      return node;
    }
  }
}
</script>
