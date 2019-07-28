<template>
  <layout>
    <h1>{{ pageNode.fullName }}</h1>

    <rich-text :html="pageNode.bio" />
  </layout>
</template>

<page-query>
query Author {
  author: allAuthor(filter: { codename: { eq: "chris_meagher" }}, limit: 1) {
    edges {
      node {
        id,
        firstName,
        lastName,
        fullName,
        bio,
        path,
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
import RichText from '~/components/RichText.vue';
import metadata from '~/mixins/Metadata';

export default {
  components: {
    RichText
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      const node = this.$page.author.edges[0].node;

      node.title = node.fullName;
      node.url = '/about';

      return node;
    }
  },
  methods: {
    getPageMetaInfo: function() {
      const node = this.pageNode;
      const metaInfo = {};

      this.addProfileMetaInfo(metaInfo, node);

      return metaInfo;
    },
    addProfileMetaInfo: function(metaInfo, node) {
      metaInfo.htmlAttrs = {
        prefix: 'profile: http://ogp.me/ns/profile#'
      };

      this.addMetaItems(metaInfo, [
        { name: 'og:type', content: 'profile' },
        { name: 'profile:first_name', content: node.firstName },
        { name: 'profile:last_name', content: node.lastName }
      ]);
    }
  }
};
</script>
