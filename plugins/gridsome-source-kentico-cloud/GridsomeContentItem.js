const { ContentItem } = require('kentico-cloud-delivery');
const changeCase = require('change-case');
const cheerio = require('cheerio');

class GridsomeContentItem extends ContentItem {
  constructor(typeName) {
    super({
      propertyResolver: (fieldName) => {
        return this.resolveProperty(fieldName);
      },
      richTextResolver: (item, context) => {
        return this.resolveRichText(item, context);
      },
      linkResolver: (link, context) => {
        // TODO: Ask Kentico Cloud why this seems to be being ignored
        return this.resolveLink(link, context);
      }
    });

    this.typeName = typeName;
  }

  resolveProperty(fieldName) {
    return this.getFieldName(fieldName);
  }

  getFieldName(fieldName) {
    const nodeFieldName = changeCase.camelCase(fieldName);

    return nodeFieldName;
  }

  resolveRichText(item, context) {
    const id = item.system.id;
    const codename = item.system.codename;

    return this.getComponentHtml(id, codename);
  }

  getComponentHtml(id, codename) {
    const componentName = changeCase.kebabCase(codename);

    const html = `<${componentName} id="${id}" codename="${codename}" />`;

    return html;
  }

  resolveLink(link, context) {
    const id = link.linkId;
    const text = context.linkText;

    return {
      asHtml: this.getLinkHtml(id, this.typeName, text)
    }
  }

  getLinkHtml(id, typeName, text) {
    const html = `<item-link id="${id}" type="${typeName}">${text}</item-link>`;

    return html;
  }

  createNode() {
    const node = this.initNode();

    this.addFields(node);

    return node;
  }

  initNode() {
    // Get system data

    const { id, name, codename, language: languageCode, type, lastModified } = this.system;

    // Initialise a content node with fields from system data, which should be consistent across all nodes

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

      field.fieldName = fieldName;

      // TODO:
      // * Custom element

      const fieldResolver = this.getFieldResolver(field);

      fieldResolver.apply(this, [node, field]);
    }
  }

  getAssetId(assetUrl) {
    const url = new URL(assetUrl);
    const pathname = url.pathname;

    // The id is the second part of the path
    const pathParts = pathname.split('/', 3);

    return pathParts[2];
  }

  getFieldResolver(field) {
    let fieldResolver = this.getFieldNameFieldResolver(field);

    if (fieldResolver === null) {
      fieldResolver = this.getFieldTypeFieldResolver(field);
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
      return this.defaultFieldResolver;
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

  multipleChoiceTypeFieldResolver(node, field) {
    const fieldName = field.fieldName;
    const value = field.value.map(choice => choice.name);

    // TODO: Maybe the value should include the "code name" also
    node.item[fieldName] = value;
  }

  richTextTypeFieldResolver(node, field) {
    const fieldName = field.fieldName;
    const html = this.getRichTextHtml(node, field);

    node.item[fieldName] = html;
  }

  getRichTextHtml(node, field) {
    let html = field.getHtml();

    html = `<div class="rich-text">${html}</div>`;

    const $ = cheerio.load(html, { decodeEntities: false });

    // Resolve item links
    // N.B. This shouldn't be necessary, but the `linkResolver` feature of the Kentico Cloud SDK doesn't appear to work

    const itemLinks = $('a[data-item-id]');
    const links = field.links;

    itemLinks.each((index, element) => {
      const itemLink = $(element);
      const itemId = itemLink.data('itemId');
      const link = links.filter(l => l.linkId === itemId)[0];
      // TODO: This assumes the default settings for getting the type name - can we pass in the type manager or content types to use here?
      const typeName = changeCase.pascalCase(link.type);
      const linkText = itemLink.html();

      const itemLinkHtml = this.getLinkHtml(itemId, typeName, linkText);

      itemLink.replaceWith(itemLinkHtml);
    });

    // Unwrap components
    // TODO: This may not work depending on delivery client settings i.e. these may not be `p` elements

    const components = $('p[data-type="item"]');

    components.each((index, element) => {
      const component = $(element);

      const componentHtml = component.html();

      component.replaceWith(componentHtml);
    });

    html = cheerio.html($('.rich-text'), { decodeEntities: false });

    return html;
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
