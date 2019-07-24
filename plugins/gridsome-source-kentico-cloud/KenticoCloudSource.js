const changeCase = require('change-case');

class KenticoCloudSource {
  constructor(deliveryClient, contentTypeFactory, richTextHtmlParser, options) {
    this.deliveryClient = deliveryClient;
    this.contentTypeFactory = contentTypeFactory;
    this.richTextHtmlParser = richTextHtmlParser;
    this.options = options;
  }

  async load(store) {
    // Deal with Taxonomy first because the content item nodes may have references to Taxonomy terms in Taxonomy fields

    await this.addTaxonomyGroupNodes(store);

    // Content types dictate the content items that are fetched and added to the data store

    const contentTypes = await this.getContentTypes();

    // Content types are also used to configure type resolvers on the deliveryClient

    this.addTypeResolvers(contentTypes);

    for (const contentType of contentTypes) {
      await this.addContentNodes(store, contentType);
    }
  }

  async addTaxonomyGroupNodes(store) {
    // Fetch taxonomy groups from the delivery client

    const taxonomyGroups = await this.deliveryClient.getTaxonomyGroups();

    for (const taxonomyGroup of taxonomyGroups.taxonomies) {
      // Add the taxonomy group to the store

      const codename = taxonomyGroup.system.codename;
      const terms = taxonomyGroup.terms;

      const typeName = this.getTaxonomyTypeName(codename);

      // These nodes are not intended to be navigable pages so they have no route or path

      const collection = store.addContentType(typeName);

      // Add taxonomy terms from this group to the collection
      // The reference is added because terms can be nested so the term nodes hold references to other terms

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

      // Terms can be nested so we will recursively call this function

      this.addTaxonomyTermNodes(collection, term.terms);
    }
  }

  async getContentTypes() {
    // Get all content types defined in Kentico Cloud

    const kcContentTypes = await this.deliveryClient.getContentTypes();

    // Create a Gridsome content type to represent each Kentico Cloud content type

    const contentTypes = kcContentTypes.types.map(contentType => {
      return this.contentTypeFactory.createContentType(contentType.system.codename);
    });

    return contentTypes;
  }

  addTypeResolvers(contentTypes) {
    // Each content type holds a reference to a ContentItem type that will be used as a type resolver

    for (const contentType of contentTypes) {
      const codename = contentType.codename;
      const ContentItem = contentType.ContentItem;

      this.deliveryClient.addTypeResolver(
        codename,
        () => new ContentItem(contentType.typeName, this.richTextHtmlParser)
      );
    }
  }

  async addContentNodes(store, contentType) {
    // Fetch content items from the delivery client

    const codename = contentType.codename;

    const content = await this.deliveryClient.getContent(codename);

    const { items: contentItems, linkedItems } = content;

    if (contentItems.length === 0) {
      // There are no content items to process so we go no further

      return;
    }

    // Create the collection using the type name and route defined by the content type

    const typeName = contentType.typeName;
    const route = contentType.route;

    const collection = store.addContentType({ typeName, route });

    // Add the linked item nodes first because the content item nodes may have references to linked items in Linked Item fields

    this.addLinkedItemNodes(store, linkedItems);

    for (const contentItem of contentItems) {
      // Create the content item node and add it to the collection

      const contentNode = contentItem.createNode();

      const node = this.addContentNode(store, collection, contentNode);

      // Also use the content item node to create an ItemLink node that will be used to resolve links to content items inside rich text fields

      this.addItemLinkNode(store, node);
    }
  }

  addLinkedItemNodes(store, linkedItems) {
    // Create the linked item collection

    const typeName = this.options.linkedItemTypeName;

    const collection = store.addContentType(typeName);

    for (const linkedItem of linkedItems) {
      // Create the linked item node and add it to the collection

      const linkedNode = linkedItem.createNode();

      // Linked items use codenames as their id, but we will preserve the "source" id in a separate field for reference

      linkedNode.item.sourceId = linkedNode.item.id;
      linkedNode.item.id = linkedNode.item.codename;

      // There is potential for linked items to be repeated, so only add it to the collection if it doesn't already exist

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
    // Add a reference to the linked items collection for all linked item fields defined on the node

    const typeName = this.options.linkedItemTypeName;

    for (const linkedItemField of node.linkedItemFields) {
      const fieldName = linkedItemField.fieldName;

      collection.addReference(fieldName, typeName);
    }
  }

  addTaxonomyFields(collection, node) {
    // Add a reference to the relevant taxonomy group collection for all taxonomy fields defined on the node

    for (const taxonomyField of node.taxonomyFields) {
      const fieldName = taxonomyField.fieldName;
      const codename = taxonomyField.taxonomyGroup;

      const typeName = this.getTaxonomyTypeName(codename);

      collection.addReference(fieldName, typeName);
    }
  }

  addAssetFields(store, collection, node) {
    // Get or create the Asset collection

    const typeName = this.options.assetTypeName;

    let assetCollection = store.getContentType(typeName);

    if (typeof (assetCollection) === 'undefined') {
      assetCollection = store.addContentType(typeName);
    }

    // Add a reference to the Asset collection for all asset fields defined on the node

    for (const assetField of node.assetFields) {
      const fieldName = assetField.fieldName;
      const assets = assetField.assets;

      for (const asset of assets) {
        const id = asset.id;

        // Only add the asset node if it does not already exist in the collection

        const existingNode = collection.getNode(id);

        if (existingNode === null) {
          assetCollection.addNode(asset);
        }
      }

      collection.addReference(fieldName, typeName);
    }
  }

  addItemLinkNode(store, node) {
    // Get or create the Item Link collection

    const typeName = this.options.itemLinkTypeName;

    let itemLinkCollection = store.getContentType(typeName);

    if (typeof (itemLinkCollection) === 'undefined') {
      itemLinkCollection = store.addContentType(typeName);
    }

    // Add the Item Link node to the collection
    // The path is generated by Gridsome based on the route defined by the content type

    const itemLinkNode = {
      id: node.id,
      typeName: node.typeName,
      path: node.path
    };

    itemLinkCollection.addNode(itemLinkNode);
  }
}

module.exports = KenticoCloudSource;
