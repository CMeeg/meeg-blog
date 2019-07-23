const changeCase = require('change-case');

class KenticoCloudSource {
  constructor(deliveryClient, contentTypeFactory, options) {
    this.deliveryClient = deliveryClient;
    this.contentTypeFactory = contentTypeFactory;
    this.options = options;
  }

  async load(store) {
    await this.addTaxonomyGroupNodes(store);

    const contentTypes = await this.getContentTypes();

    this.addTypeResolvers(contentTypes);

    for (const contentType of contentTypes) {
      await this.addContentNodes(store, contentType);
    }
  }

  async addTaxonomyGroupNodes(store) {
    // TODO: Move taxonomy stuff out to another class?

    const taxonomyGroups = await this.deliveryClient.getTaxonomyGroups();

    for (const taxonomyGroup of taxonomyGroups.taxonomies) {
      const codename = taxonomyGroup.system.codename;
      const terms = taxonomyGroup.terms;

      const typeName = this.getTaxonomyTypeName(codename);

      const collection = store.addContentType(typeName);

      collection.addReference('terms', typeName);

      this.addTaxonomyTermNodes(collection, terms);
    }
  }

  getTaxonomyTypeName(codename) {
    const typeNamePrefix = this.options.taxonomyTypeNamePrefix;
    const typeName = typeNamePrefix + changeCase.pascalCase(codename);

    return typeName;
  }

  addTaxonomyTermNodes(collection, terms) {
    if (terms.length === 0) {
      return;
    }

    for (const term of terms) {
      collection.addNode({
        id: term.codename,
        name: term.name,
        terms: term.terms.map(childTerm => childTerm.codename)
      });

      // Terms can be nested

      this.addTaxonomyTermNodes(collection, term.terms);
    }
  }

  async getContentTypes() {
    const kcContentTypes = await this.deliveryClient.getContentTypes();

    const contentTypes = kcContentTypes.types.map(contentType => {
      return this.contentTypeFactory.createContentType(contentType.system.codename);
    });

    return contentTypes;
  }

  addTypeResolvers(contentTypes) {
    for (const contentType of contentTypes) {
      const codename = contentType.codename;
      const ContentItem = contentType.ContentItem;

      this.deliveryClient.addTypeResolver(
        codename,
        () => new ContentItem(contentType.typeName)
      );
    }
  }

  async addContentNodes(store, contentType) {
    const codename = contentType.codename;
    const typeName = contentType.typeName;
    const route = contentType.route;

    // TODO: Create this only if needed i.e. if there are content items
    const collection = store.addContentType({ typeName, route });

    const content = await this.deliveryClient.getContent(codename);

    const { items: contentItems, linkedItems } = content;

    this.addLinkedItemNodes(store, linkedItems);

    for (const contentItem of contentItems) {
      const contentNode = contentItem.createNode();

      const node = this.addContentNode(store, collection, contentNode);

      this.addItemLinkNode(store, node);
    }
  }

  addLinkedItemNodes(store, linkedItems) {
    // TODO: Move linked item stuff out to another class?

    const typeName = this.options.linkedItemTypeName;

    const collection = store.addContentType(typeName);

    for (const linkedItem of linkedItems) {
      const linkedNode = linkedItem.createNode();

      linkedNode.item.sourceId = linkedNode.item.id;
      linkedNode.item.id = linkedNode.item.codename;

      const existingNode = collection.getNode(linkedNode.item.id);

      if (existingNode === null) {
        this.addContentNode(store, collection, linkedNode);
      }
    }
  }

  addContentNode(store, collection, node) {
    this.addLinkedItemFields(collection, node);

    this.addTaxonomyFields(collection, node);

    this.addAssetFields(store, collection, node);

    return collection.addNode(node.item);
  }

  addLinkedItemFields(collection, node) {
    const typeName = this.options.linkedItemTypeName;

    for (const linkedItemField of node.linkedItemFields) {
      const fieldName = linkedItemField.fieldName;

      collection.addReference(fieldName, typeName);
    }
  }

  addTaxonomyFields(collection, node) {
    for (const taxonomyField of node.taxonomyFields) {
      const fieldName = taxonomyField.fieldName;
      const codename = taxonomyField.taxonomyGroup;

      const typeName = this.getTaxonomyTypeName(codename);

      collection.addReference(fieldName, typeName);
    }
  }

  addAssetFields(store, collection, node) {
    const typeName = this.options.assetTypeName;

    let assetCollection = store.getContentType(typeName);

    if (typeof (assetCollection) === 'undefined') {
      assetCollection = store.addContentType(typeName);
    }

    for (const assetField of node.assetFields) {
      const fieldName = assetField.fieldName;
      const assets = assetField.assets;

      for (const asset of assets) {
        const id = asset.id;

        const existingNode = collection.getNode(id);

        if (existingNode === null) {
          assetCollection.addNode(asset);
        }
      }

      collection.addReference(fieldName, typeName);
    }
  }

  addItemLinkNode(store, node) {
    // TODO: Make this an option
    const typeName = 'ItemLink';

    let itemLinkCollection = store.getContentType(typeName);

    if (typeof (itemLinkCollection) === 'undefined') {
      itemLinkCollection = store.addContentType(typeName);
    }

    const itemLinkNode = {
      id: node.id,
      typeName: node.typeName,
      path: node.path
    };

    itemLinkCollection.addNode(itemLinkNode);
  }
}

module.exports = KenticoCloudSource;
