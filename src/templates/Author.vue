<template>
  <div>
    <page-intro title="About me" />

    <rich-text :html="pageNode.bio" />
  </div>
</template>

<page-query>
query Author ($id: ID!) {
  author (id: $id) {
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
      const node = this.$page.author;

      node.title = node.fullName;

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
