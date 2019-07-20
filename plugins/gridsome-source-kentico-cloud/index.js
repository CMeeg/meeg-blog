const DeliveryClient = require('./GridsomeDeliveryClient');
const KenticoCloudSource = require('./KenticoCloudSource');
const GridsomeContentTypeManager = require('./GridsomeContentTypeManager');

class KenticoCloudSourcePlugin {
  static defaultOptions() {
    return {
      deliveryClientConfig: {
        projectId: ''
      },
      contentTypeConfig: {
        contentItemPath: './plugins/gridsome-source-kentico-cloud/content-types'
      },
      linkedItemTypeName: 'LinkedItem',
      taxonomyTypeNamePrefix: 'Taxonomy',
      assetTypeName: 'Asset'
    }
  };

  constructor(api, options) {
    const contentTypeManager = this.getContentTypeManager(options);

    const kenticoCloudSource = this.getKenticoCloudSource(options, contentTypeManager);

    api.loadSource(async store => kenticoCloudSource.load(store));
  }

  getContentTypeManager(options) {
    const deliveryClient = new DeliveryClient(options.deliveryClientConfig);

    const contentTypeManager = new GridsomeContentTypeManager(deliveryClient, options.contentTypeConfig);

    return contentTypeManager;
  }

  getKenticoCloudSource(options, contentTypeManager) {
    const deliveryClient = new DeliveryClient(options.deliveryClientConfig, contentTypeManager);

    // TODO: Don't pass in options - separate concerns into their own classes
    const kenticoCloudSource = new KenticoCloudSource(deliveryClient, contentTypeManager, options);

    return kenticoCloudSource;
  }
}

module.exports = KenticoCloudSourcePlugin;
