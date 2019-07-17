const { TypeResolver, DeliveryClient } = require('kentico-cloud-delivery');

class GridsomeDeliveryClient {
  constructor(deliveryClientConfig, contentTypes) {
    const typeResolvers = this.getTypeResolvers(contentTypes);
    deliveryClientConfig.typeResolvers = typeResolvers;

    this.deliveryClient = new DeliveryClient(deliveryClientConfig);
  }

  getTypeResolvers(contentTypes) {
    const typeResolvers = [];

    for (const contentType of contentTypes) {
      const codename = contentType.codename;
      const ContentType = contentType.contentType;

      typeResolvers.push(
        new TypeResolver(codename, () => new ContentType(codename))
      );
    }

    return typeResolvers;
  }

  async getContentTypes() {
    const contentTypesPromise = await this.deliveryClient
      .types()
      .getPromise();

    return contentTypesPromise;
  }

  async getContent(codename) {
    const contentPromise = await this.deliveryClient
      .items()
      .type(codename)
      .depthParameter(3)
      .getPromise();

    return contentPromise;
  }

  async getTaxonomyGroups() {
    const taxonomyGroupsPromise = await this.deliveryClient
      .taxonomies()
      .getPromise();

    return taxonomyGroupsPromise;
  }
}

module.exports = GridsomeDeliveryClient;
