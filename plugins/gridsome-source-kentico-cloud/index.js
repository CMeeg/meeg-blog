const DeliveryClient = require('./GridsomeDeliveryClient');
const KenticoCloudSource = require('./KenticoCloudSource');
const GridsomeContentItemFactory = require('./GridsomeContentItemFactory');
const GridsomeTaxonomyItemFactory = require('./GridsomeTaxonomyItemFactory');

class KenticoCloudSourcePlugin {
  static defaultOptions() {
    return {
      deliveryClientConfig: {
        projectId: '',
        contentItemsDepth: 3
      },
      contentItemConfig: {
        contentItemTypeNamePrefix: '',
        contentItems: {},
        routes: {},
        richText: {
          wrapperCssClass: 'rich-text',
          componentNamePrefix: '',
          itemLinkSelector: 'a[data-item-id]',
          itemLinkComponentName: 'item-link',
          componentSelector: 'p[data-type="item"]',
          assetSelector: 'figure[data-asset-id]',
          assetComponentName: 'asset'
        },
        assetTypeName: 'Asset',
        itemLinkTypeName: 'ItemLink'
      },
      taxonomyConfig: {
        taxonomyTypeNamePrefix: 'Taxonomy',
        routes: {}
      }
    }
  };

  constructor(api, options) {
    api.loadSource(async store => {
      const deliveryClient = new DeliveryClient(options.deliveryClientConfig);
      const contentItemFactory = new GridsomeContentItemFactory(options.contentItemConfig);
      const taxonomyItemFactory = new GridsomeTaxonomyItemFactory(options.taxonomyConfig);

      const kenticoCloudSource = new KenticoCloudSource(
        deliveryClient,
        contentItemFactory,
        taxonomyItemFactory
      );

      await kenticoCloudSource.load(store);
    });
  }
}

module.exports = KenticoCloudSourcePlugin;
