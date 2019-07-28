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
      const imgAsset = this.getMetaInfoImage(node.pageMetadataOpenGraphImage);

      this.addMetaItems(metaInfo, [
        { name: 'og:type', content: 'website' },
        { name: 'og:title', content: title },
        { name: 'og:url', content: appConfig.getSiteUrl(url) },
        { name: 'og:description', content: description },
        { name: 'og:site_name', content: appConfig.siteName },
        { name: 'og:image', content: imgAsset.url },
        { name: 'og:image:alt', content: imgAsset.description }
      ]);
    },
    addTwitterCardMetaInfo: function(metaInfo, node) {
      const title = node.pageMetadataOpenGraphTitle || node.pageMetadataMetaTitle || node.title;
      const description = node.pageMetadataOpenGraphDescription || node.pageMetadataMetaDescription;
      const url = node.url || node.path;
      const imgAsset = this.getMetaInfoImage(node.pageMetadataOpenGraphImage);

      this.addMetaItems(metaInfo, [
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: `@${appConfig.siteTwitterUser}` },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:url', content: appConfig.getSiteUrl(url) },
        { name: 'twitter:image', content: imgAsset.url },
        { name: 'twitter:image:alt', content: imgAsset.description }
      ]);
    },
    addMetaItems: function(metaInfo, items) {
      for (const item of items) {
        this.addMetaItem(metaInfo, item);
      }
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
    },
    getMetaInfoImage(asset) {
      if (typeof(asset) !== 'undefined' && asset !== null) {
        return asset;
      }

      return {
        url: appConfig.getSiteUrl('/assets/og-fallback.jpg'),
        description: null
      };
    }
  }
}

export default metadata;
