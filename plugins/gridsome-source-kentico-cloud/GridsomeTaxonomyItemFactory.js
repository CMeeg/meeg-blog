const changeCase = require('change-case');
const GridsomeTaxonomyItem = require('./GridsomeTaxonomyItem');
const slugify = require('@sindresorhus/slugify');

class GridsomeTaxonomyItemFactory {
  constructor(options) {
    this.options = options;
  }

  getTypeName(codename) {
    const typeNamePrefix = this.options.taxonomyTypeNamePrefix;
    const typeName = `${typeNamePrefix}${changeCase.pascalCase(codename)}`;

    return typeName;
  }

  getRoute(codename) {
    if (!this.addRouting(codename)) {
      return null;
    }

    const route = `/${slugify(codename)}/:slug`;

    return route;
  }

  addRouting(codename) {
    const addRoutingTo = this.options.addRoutingTo;

    if (!Array.isArray(addRoutingTo)) {
      return false;
    }

    return addRoutingTo.includes(codename);
  }

  createTaxonomyItem(taxonomyGroup) {
    const codename = taxonomyGroup.system.codename;
    const typeName = this.getTypeName(codename);
    const route = this.getRoute(codename);
    const terms = taxonomyGroup.terms;

    return new GridsomeTaxonomyItem(typeName, route, terms);
  }
}

module.exports = GridsomeTaxonomyItemFactory;
