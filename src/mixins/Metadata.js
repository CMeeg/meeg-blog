const { merge } = require('lodash');
const appConfig = require('~/app.config.js');

var metadata = {
  metaInfo: function() {
    const defaultMetaInfo = this.getDefaultMetaInfo();
    const pageMetaInfo = this.getPageMetaInfo();

    const meta = merge(
      {},
      defaultMetaInfo,
      pageMetaInfo
    );

    return meta;
  },
  computed: {
    pageNode: function() {
      return null;
    }
  },
  methods: {
    getDefaultMetaInfo() {
      const node = this.pageNode;

      if (node === null) {
        return;
      }

      const metaInfo = {};

      this.addBasicMetaInfo(metaInfo, node);
      this.addOpenGraphMetaInfo(metaInfo, node);
      this.addTwitterCardMetaInfo(metaInfo, node);

      return metaInfo;
    },
    getPageMetaInfo() {
      return {};
    },
    addBasicMetaInfo: function(metaInfo, node) {
      const title = node.pageMetadataMetaTitle || node.title;

      metaInfo.title = title;

      this.addMetaItems(metaInfo, [
        { name: 'description', content: node.pageMetadataMetaDescription }
      ]);
    },
    addOpenGraphMetaInfo: function(metaInfo, node) {
      const title = node.pageMetadataOpenGraphTitle || node.pageMetadataMetaTitle || node.title;
      const description = node.pageMetadataOpenGraphDescription || node.pageMetadataMetaDescription;
      const url = node.url || node.path;

      this.addMetaItems(metaInfo, [
        { name: 'og:type', content: 'website' },
        { name: 'og:title', content: title },
        { name: 'og:url', content: appConfig.getSiteUrl(url) },
        { name: 'og:description', content: description },
        { name: 'og:site_name', content: appConfig.siteName },
        // TODO: Populate this - needs to be absolute url and have a fallback image
        { name: 'og:image', content: null }
      ]);

      /*
      TODO: Add these optional image props, if possible
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="300" />
      <meta property="og:image:alt" content="A shiny red apple with a bite taken out" />
      */
    },
    addTwitterCardMetaInfo: function(metaInfo, node) {
      const title = node.pageMetadataOpenGraphTitle || node.pageMetadataMetaTitle || node.title;
      const description = node.pageMetadataOpenGraphDescription || node.pageMetadataMetaDescription;
      const url = node.url || node.path;

      this.addMetaItems(metaInfo, [
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: `@${appConfig.siteTwitterUser}` },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:url', content: appConfig.getSiteUrl(url) },
        // TODO: Populate this - needs to be absolute url and have a fallback image
        { name: 'twitter:image', content: null }
      ]);

      /*
      TODO: Add these, if possible
      twitter:image:alt
      */
    },
    addMetaItems: function(metaInfo, items) {
      for (const item of items) {
        this.addMetaItem(metaInfo, item);
      }

      return true;
    },
    addMetaItem: function(metaInfo, item) {
      if (!this.canAddMetaItem(item)) {
        return;
      }

      if (typeof(metaInfo.meta) === 'undefined') {
        metaInfo.meta = [];
      }

      metaInfo.meta.push({ key: item.name, name: item.name, content: item.content });
    },
    canAddMetaItem(item) {
      const content = item.content;

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
