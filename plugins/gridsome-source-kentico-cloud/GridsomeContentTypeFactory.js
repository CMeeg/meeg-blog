const path = require('path');
const glob = require('glob');
const changeCase = require('change-case');
const slugify = require('@sindresorhus/slugify');
const GridsomeContentItem = require('./GridsomeContentItem');

class GridsomeContentTypeFactory {
  constructor(options) {
    this.options = options;

    this.contentItems = this.loadContentItemsFromFileSystem();
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

  createContentType(codename) {
    const typeName = this.getTypeName(codename);
    const route = this.getRoute(codename);

    let ContentItem = this.contentItems[codename];

    if (typeof(ContentItem) === 'undefined') {
      // Fallback to GridsomeContentItem if there is no specific content item defined for this content type

      ContentItem = GridsomeContentItem;
    }

    const contentType = {
      codename,
      typeName,
      route,
      ContentItem
    }

    return contentType;
  }

  getTypeName(codename) {
    const typeName = changeCase.pascalCase(codename);

    return typeName;
  }

  getRoute(codename) {
    const route = `/${this.slugify(codename)}/:slug`;

    return route;
  }

  slugify(value) {
    return slugify(value);
  }
}

module.exports = GridsomeContentTypeFactory;
