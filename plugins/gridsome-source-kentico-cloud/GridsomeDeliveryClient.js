const { TypeResolver, DeliveryClient } = require('kentico-cloud-delivery');

class GridsomeDeliveryClient {
  constructor(deliveryClientConfig, contentTypeManager) {
    this.deliveryClientConfig = deliveryClientConfig;
    this.contentTypeManager = contentTypeManager;
  }

  async getDeliveryClient() {
    if (typeof(this.deliveryClient) !== 'undefined') {
      return this.deliveryClient;
    }

    const typeResolvers = await this.getTypeResolvers();
    this.deliveryClientConfig.typeResolvers = typeResolvers;

    this.deliveryClient = new DeliveryClient(this.deliveryClientConfig);

    return this.deliveryClient;
  }

  async getTypeResolvers() {
    if (typeof(this.contentTypeManager) === 'undefined') {
      return null;
    }

    // Create type resolvers from content types

    const contentTypes = await this.contentTypeManager.getContentTypes();

    const typeResolvers = contentTypes.map(contentType => {
      const codename = contentType.codename;
      const typeName = contentType.typeName;
      const ContentItem = contentType.ContentItem;

      return new TypeResolver(codename, () => new ContentItem(typeName))
    });

    return typeResolvers;
  }

  async getContentTypes() {
    const deliveryClient = new DeliveryClient(this.deliveryClientConfig);

    const contentTypesPromise = await deliveryClient
      .types()
      .getPromise();

    return contentTypesPromise;
  }

  async getContent(codename) {
    const deliveryClient = await this.getDeliveryClient();

    const contentPromise = await deliveryClient
      .items()
      .type(codename)
      .depthParameter(3)
      .getPromise();

    return contentPromise;
  }

  async getTaxonomyGroups() {
    const deliveryClient = await this.getDeliveryClient();

    const taxonomyGroupsPromise = await deliveryClient
      .taxonomies()
      .getPromise();

    return taxonomyGroupsPromise;
  }
}

module.exports = GridsomeDeliveryClient;
