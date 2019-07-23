const { TypeResolver, DeliveryClient } = require('kentico-cloud-delivery');

class GridsomeDeliveryClient {
  constructor(deliveryClientConfig) {
    this.deliveryClientConfig = deliveryClientConfig;

    this.deliveryClient = null;
  }

  getDeliveryClient() {
    if (this.deliveryClient !== null) {
      return this.deliveryClient;
    }

    this.deliveryClient = new DeliveryClient(this.deliveryClientConfig);

    return this.deliveryClient;
  }

  addTypeResolver(codename, createContentItemFunc) {
    if (typeof(this.deliveryClientConfig.typeResolvers) === 'undefined') {
      this.deliveryClientConfig.typeResolvers = [];
    }

    this.deliveryClientConfig.typeResolvers.push(
      new TypeResolver(
        codename,
        createContentItemFunc
      )
    );

    // We can't add a type resolver after the delivery client has been created so
    // we clear it out so it can be recreated by `getDeliveryClient`

    this.deliveryClient = null;
  }

  async getContentTypes() {
    const deliveryClient = this.getDeliveryClient();

    const contentTypes = await deliveryClient
      .types()
      .getPromise();

    return contentTypes;
  }

  async getContent(codename) {
    const deliveryClient = this.getDeliveryClient();

    const contentItems = await deliveryClient
      .items()
      .type(codename)
      .depthParameter(3)
      .getPromise();

    return contentItems;
  }

  async getTaxonomyGroups() {
    const deliveryClient = this.getDeliveryClient();

    const taxonomyGroups = await deliveryClient
      .taxonomies()
      .getPromise();

    return taxonomyGroups;
  }
}

module.exports = GridsomeDeliveryClient;
