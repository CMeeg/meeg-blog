const { ContentItem } = require('kentico-cloud-delivery');
const changeCase = require('change-case');

class GridsomeContentItem extends ContentItem {
  constructor(typeName, richTextHtmlParser) {
    super({
      propertyResolver: (fieldName) => {
        return this.resolveProperty(fieldName);
      },
      richTextResolver: (item, context) => {
        return this.resolveRichText(item, context);
      },
      linkResolver: (link, context) => {
        // TODO: Ask Kentico Cloud why this seems to be being ignored
        // Removing this results in warnings from the DeliveryClient when advanced logging is turned on
        return this.resolveLink(link, context);
      }
    });

    this.typeName = typeName;
    this.richTextHtmlParser = richTextHtmlParser;
  }

  resolveProperty(fieldName) {
    return this.getFieldName(fieldName);
  }

  getFieldName(fieldName) {
    const nodeFieldName = changeCase.camelCase(fieldName);

    return nodeFieldName;
  }

  resolveRichText(item, context) {
    const type = item.system.type;
    const id = item.system.id;
    const codename = item.system.codename;

    return this.richTextHtmlParser.getComponentHtml(type, id, codename);
  }

  resolveLink(link, context) {
    const id = link.linkId;
    const text = context.linkText;

    return {
      asHtml: this.richTextHtmlParser.getLinkHtml(id, this.typeName, text)
    }
  }

  createNode() {
    const node = this.initNode();

    this.addFields(node);

    return node;
  }

  initNode() {
    // Get system data

    const { id, name, codename, language: languageCode, type, lastModified } = this.system;

    // Initialise a content node with fields from system data, which should be consistent across all nodes in Gridsome

    const node = {
      item: {
        id,
        name,
        codename,
        languageCode,
        type,
        typeName: this.typeName,
        lastModified: new Date(lastModified),
        slug: null // Will be overwritten if a `URL slug` type field is present on the content type
      },
      assetFields: [],
      linkedItemFields: [],
      taxonomyFields: []
    };

    return node;
  }

  addFields(node) {
    // Add Content Elements as fields to the node

    for (const codename in this.elements) {
      const element = this.elements[codename];
      const fieldName = this.getFieldName(codename);
      let field = this[fieldName];

      if (element.type === 'modular_content') {
        // "Linked items" fields are different to all others for some reason so we force it to be more uniform
        // TODO : Ask Kentico Cloud to make it consistent

        field = {
          name: element.name,
          type: element.type,
          value: element.value,
          linkedItems: field
        };
      }

      if (element.type === 'asset') {
        // The AssetModel doesn't have width and height, but the element value does so we will map those values across
        // TODO: Ask Kentico Cloud to add width and height

        field.assets = field.assets.map(asset => {
          const url = asset.url;

          element.value
            .filter(elementAsset => elementAsset.url === url)
            .map(elementAsset => {
              asset.width = elementAsset.width;
              asset.height = elementAsset.height;
            });

          // We also need to extract an id from the url as it is not provided
          // TODO: Ask Kentico Cloud if it can be provided

          asset.id = this.getAssetId(url);

          return asset;
        });
      }

      // Get a Field Resolver and use it to add the field and its value to the node
      // TODO: Custom element fields

      field.fieldName = fieldName;

      const fieldResolver = this.getFieldResolver(field);

      fieldResolver.apply(this, [node, field]);
    }
  }

  getAssetId(assetUrl) {
    const url = new URL(assetUrl);
    const pathname = url.pathname;

    // The id is the second part of the path
    // TODO: This doesn't seem to match up with the actual id - it does seem to be unique per asset so it is ok to use, but the actual id would be better

    const pathParts = pathname.split('/', 3);

    return pathParts[2];
  }

  getFieldResolver(field) {
    // Try to get a field resolver based on the field name

    let fieldResolver = this.getFieldNameFieldResolver(field);

    if (fieldResolver === null) {
      // Fall back to getting a field resolver based on the field type

      fieldResolver = this.getFieldTypeFieldResolver(field);
    }

    if (fieldResolver === null) {
      fieldResolver = this.defaultFieldResolver;
    }

    return fieldResolver;
  }

  getFieldNameFieldResolver(field) {
    const fieldName = field.fieldName;

    const fieldResolver = this[fieldName + 'FieldResolver'];

    if (typeof (fieldResolver) === 'undefined') {
      return null;
    }

    return fieldResolver;
  }

  getFieldTypeFieldResolver(field) {
    const typeName = changeCase.camelCase(field.type);

    const fieldResolver = this[typeName + 'TypeFieldResolver'];

    if (typeof (fieldResolver) === 'undefined') {
      return null;
    }

    return fieldResolver;
  }

  numberTypeFieldResolver(node, field) {
    const fieldName = field.fieldName;
    const value = Number(field.value);

    node.item[fieldName] = value;
  }

  dateTimeTypeFieldResolver(node, field) {
    const fieldName = field.fieldName;
    const value = new Date(field.value);

    node.item[fieldName] = value;
  }

  richTextTypeFieldResolver(node, field) {
    const fieldName = field.fieldName;
    const html = this.richTextHtmlParser.getRichTextHtml(field);

    node.item[fieldName] = html;
  }

  modularContentTypeFieldResolver(node, field) {
    const fieldName = field.fieldName;
    const linkedItems = field.linkedItems;
    const value = field.value;

    const linkedItemField = {
      fieldName,
      linkedItems
    };

    node.linkedItemFields.push(linkedItemField);

    node.item[fieldName] = value;
  }

  taxonomyTypeFieldResolver(node, field) {
    const fieldName = field.fieldName;
    const value = field.taxonomyTerms.map(term => term.codename);
    const taxonomyGroup = field.taxonomyGroup;

    node.item[fieldName] = value;

    const taxonomyField = {
      fieldName,
      taxonomyGroup
    };

    node.taxonomyFields.push(taxonomyField);
  }

  assetTypeFieldResolver(node, field) {
    const fieldName = field.fieldName;
    const assets = field.assets;
    const value = assets.map(asset => asset.id);

    const assetField = {
      fieldName,
      assets
    };

    node.assetFields.push(assetField);

    node.item[fieldName] = value;
  }

  urlSlugTypeFieldResolver(node, field) {
    const value = field.value;

    node.item.slug = value;
  }

  defaultFieldResolver(node, field) {
    const fieldName = field.fieldName;
    const value = field.value;

    node.item[fieldName] = value;
  }
}

module.exports = GridsomeContentItem;
