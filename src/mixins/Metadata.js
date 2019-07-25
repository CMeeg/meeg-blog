var metadata = {
  metaInfo: function() {
    const node = this.pageNode;

    if (node === null) {
      return;
    }

    const meta = {};

    this.addPageMetadata(meta, node);
    this.addOpenGraphMetadata(meta, node);
    this.addTwitterCardMetadata(meta, node);

    return meta;
  },
  computed: {
    pageNode: function() {
      return null;
    }
  },
  methods: {
    addPageMetadata: function(meta, node) {
      const title = `${node.pageMetadataMetaTitle || node.title} - Chris Meagher`;

      meta.title = title;

      this.addMetadataItem(meta, { name: 'title', content: title });
      this.addMetadataItem(meta, { name: 'description', content: node.pageMetadataMetaDescription });
    },
    addOpenGraphMetadata: function(meta, node) {
      // TODO: Are any of these required? I.e. we should bail out if not set

      this.addMetadataItem(meta, { name: 'og:type', content: 'website' });
      // TODO: Needs to be absolute url
      this.addMetadataItem(meta, { name: 'og:url', content: node.path });
      // TODO: Title and desription may need to be different for social media
      this.addMetadataItem(meta, { name: 'og:title', content: node.title });
      this.addMetadataItem(meta, { name: 'og:description', content: node.pageMetadataMetaDescription });
      // TODO: Populate this - needs to be absolute url
      this.addMetadataItem(meta, { name: 'og:image', content: null });
    },
    addTwitterCardMetadata: function(meta, node) {
      // TODO: Are any of these required? I.e. we should bail out if not set

      this.addMetadataItem(meta, { name: 'twitter:card', content: 'summary_large_image' });
      // TODO: Needs to be absolute url
      this.addMetadataItem(meta, { name: 'twitter:url', content: node.path });
      // TODO: Title and desription may need to be different for social media
      this.addMetadataItem(meta, { name: 'twitter:title', content: node.title });
      this.addMetadataItem(meta, { name: 'twitter:description', content: node.pageMetadataMetaDescription });
      // TODO: Populate this - needs to be absolute url
      this.addMetadataItem(meta, { name: 'twitter:image', content: null });
    },
    addMetadataItem: function(meta, item) {
      if (!this.isSet(item.content)) {
        return;
      }

      if (typeof(meta.meta) === 'undefined') {
        meta.meta = [];
      }

      meta.meta.push(item);
    },
    isSet(content) {
      if (typeof(content) === 'undefined') {
        return false;
      }

      if (content === null || content === '') {
        return false;
      }

      return true;
    }
  }
}

export default metadata;
