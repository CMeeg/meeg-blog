const DeliveryClient = require('./GridsomeDeliveryClient');
const KenticoCloudSource = require('./KenticoCloudSource');
const GridsomeContentTypeFactory = require('./GridsomeContentTypeFactory');

class KenticoCloudSourcePlugin {
  static defaultOptions() {
    return {
      deliveryClientConfig: {
        projectId: '',
        contentItemsDepth: 3
      },
      contentTypeConfig: {
        contentTypeNamePrefix: '',
        contentItemPath: './plugins/gridsome-source-kentico-cloud/content-types'
      },
      dataStoreConfig: {
        taxonomyTypeNamePrefix: 'Taxonomy',
        linkedItemTypeName: 'LinkedItem',
        assetTypeName: 'Asset',
        itemLinkTypeName: 'ItemLink'
      }
    }
  };

  constructor(api, options) {
    const deliveryClient = new DeliveryClient(options.deliveryClientConfig);

    const contentTypeFactory = new GridsomeContentTypeFactory(options.contentTypeConfig);

    const kenticoCloudSource = new KenticoCloudSource(deliveryClient, contentTypeFactory, options.dataStoreConfig);

    api.loadSource(async store => kenticoCloudSource.load(store));
  }
}

module.exports = KenticoCloudSourcePlugin;
