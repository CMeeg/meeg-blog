const changeCase = require('change-case');
const glob = require('glob');
const GridsomeContentItem = require('./GridsomeContentItem');
const path = require('path');
const RichTextHtmlParser = require('./RichTextHtmlParser');
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
    const route = `/${slugify(codename)}/:slug`;

    return route;
  }

  createContentItem(contentType) {
    const codename = contentType.system.codename;
    const typeName = this.getTypeName(codename);

    if (this.contentItems === null) {
      this.contentItems = this.loadContentItemsFromFileSystem();
    }

    const route = this.getRoute(codename);
    const richTextHtmlParser = this.getRichTextHtmlParser();

    const ContentItem = this.contentItems[codename];

    if (typeof(ContentItem) === 'undefined') {
      // Fallback to GridsomeContentItem if there is no specific content item defined for this content type

      return new GridsomeContentItem(typeName, route, richTextHtmlParser);
    }

    return new ContentItem(typeName, route, richTextHtmlParser);
  }

  loadContentItemsFromFileSystem() {
    // We will try to load GridsomeContentItem types from the path provided

    const contentItemPath = this.options.contentItemPath;
    const extension = '.js';
    const contentItemGlob = `${path.join(contentItemPath, '/*')}${extension}`;

    const contentItems = {};

    glob.sync(contentItemGlob).forEach(file => {
      const codename = path.basename(file, extension);
      const contentItemPath = path.resolve(file);
      const contentItem = require(contentItemPath);

      contentItems[codename] = contentItem;
    });

    return contentItems;
  }

  getRichTextHtmlParser() {
    return new RichTextHtmlParser(this.getTypeName, this.options.richText);
  }

  getAssetTypeName() {
    return this.options.assetTypeName;
  }

  getItemLinkTypeName() {
    return this.options.itemLinkTypeName;
  }
}

module.exports = GridsomeContentItemFactory;
