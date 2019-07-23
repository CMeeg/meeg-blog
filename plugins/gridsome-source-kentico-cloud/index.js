const DeliveryClient = require('./GridsomeDeliveryClient');
const KenticoCloudSource = require('./KenticoCloudSource');
const GridsomeContentTypeFactory = require('./GridsomeContentTypeFactory');

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
    const deliveryClient = new DeliveryClient(options.deliveryClientConfig);

    const contentTypeFactory = new GridsomeContentTypeFactory(options.contentTypeConfig);

    // TODO: Don't pass in options - separate concerns into their own classes
    const kenticoCloudSource = new KenticoCloudSource(deliveryClient, contentTypeFactory, options);

    api.loadSource(async store => kenticoCloudSource.load(store));
  }
}

module.exports = KenticoCloudSourcePlugin;
