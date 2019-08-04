const changeCase = require('change-case');
const GridsomeContentItem = require('./GridsomeContentItem');
const slugify = require('@sindresorhus/slugify');

class GridsomeContentItemFactory {
  constructor(options) {
    this.options = options;

    this.contentItems = null;
  }

  getTypeName(codename) {
    const typeNamePrefix = this.options.contentItemTypeNamePrefix;
    const typeName = `${typeNamePrefix}${changeCase.pascalCase(codename)}`;

    return typeName;
  }

  getRoute(codename) {
    const route = this.options.routes[codename];

    if (typeof(route) === 'undefined') {
      return `/${slugify(codename)}/:slug`;
    }

    return route;
  }

  getContentItem(codename) {
    const ContentItem = this.options.contentItems[codename];

    if (typeof(ContentItem) === 'undefined') {
      return GridsomeContentItem;
    }

    return ContentItem;
  }

  getRichTextHtmlParser() {
    if (this.options.richText.htmlParser === null) {
      return null;
    }

    const HtmlParser = this.options.richText.htmlParser;

    return new HtmlParser(this.getTypeName, this.options.richText);
  }

  createContentItem(contentType) {
    const codename = contentType.system.codename;
    const typeName = this.getTypeName(codename);
    const route = this.getRoute(codename);
    const ContentItem = this.getContentItem(codename);
    const richTextHtmlParser = this.getRichTextHtmlParser();

    return new ContentItem(typeName, route, richTextHtmlParser);
  }

  getAssetTypeName() {
    return this.options.assetTypeName;
  }

  getItemLinkTypeName() {
    return this.options.itemLinkTypeName;
  }
}

module.exports = GridsomeContentItemFactory;
