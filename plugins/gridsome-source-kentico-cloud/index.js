const DeliveryClient = require('./GridsomeDeliveryClient');
const KenticoCloudSource = require('./KenticoCloudSource');
const GridsomeContentTypeFactory = require('./GridsomeContentTypeFactory');
const RichTextHtmlParser = require('./RichTextHtmlParser');

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
      },
      richTextHtmlParserConfig: {
        wrapperCssClass: 'rich-text',
        itemLinkSelector: 'a[data-item-id]',
        componentSelector: 'p[data-type="item"]'
      }
    }
  };

  constructor(api, options) {
    const deliveryClient = new DeliveryClient(options.deliveryClientConfig);

    const contentTypeFactory = new GridsomeContentTypeFactory(options.contentTypeConfig);

    const richTextHtmlParser = new RichTextHtmlParser(contentTypeFactory, options.richTextHtmlParserConfig);

    const kenticoCloudSource = new KenticoCloudSource(deliveryClient, contentTypeFactory, richTextHtmlParser, options.dataStoreConfig);

    api.loadSource(async store => kenticoCloudSource.load(store));
  }
}

module.exports = KenticoCloudSourcePlugin;
