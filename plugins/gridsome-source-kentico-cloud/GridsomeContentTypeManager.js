const path = require('path');
const glob = require('glob');
const changeCase = require('change-case');
const slugify = require('@sindresorhus/slugify');
const GridsomeContentItem = require('./GridsomeContentItem');

class GridsomeContentTypeManager {
  constructor(deliveryClient, options) {
    this.deliveryClient = deliveryClient;
    this.options = options;
  }

  async getContentTypes() {
    if (typeof(this.contentTypes) !== 'undefined') {
      return this.contentTypes;
    }

    const kcContentTypes = await this.deliveryClient.getContentTypes();

    const gridsomeContentTypes = this.loadContentTypes();

    const contentTypes = kcContentTypes.types.map(kcContentType => {
      const codename = kcContentType.system.codename;
      const typeName = this.getTypeName(codename);
      const route = this.getRoute(codename);

      let ContentItem = gridsomeContentTypes[codename];

      if (typeof(ContentItem) === 'undefined') {
        ContentItem = GridsomeContentItem;
      }

      return {
        codename,
        typeName,
        route,
        ContentItem
      }
    });

    return contentTypes;
  }

  loadContentTypes() {
    // We will try to load GridsomeContentItem types from the path provided

    const contentItemPath = this.options.contentItemPath;
    const extension = '.js';
    const contentItemGlob = `${path.join(contentItemPath, '/*')}${extension}`;

    const contentTypes = {};

    glob.sync(contentItemGlob).forEach(file => {
      const codename = path.basename(file, extension);
      const contentItemPath = path.resolve(file);
      const contentItem = require(contentItemPath);

      contentTypes[codename] = contentItem;
    });

    return contentTypes;
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

module.exports = GridsomeContentTypeManager;
