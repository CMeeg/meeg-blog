const changeCase = require('change-case');
const cheerio = require('cheerio');

class GridsomeRichTextHtmlParser {
  constructor(typeNameResolver, options) {
    this.typeNameResolver = typeNameResolver;
    this.options = options;
  }

  getRichTextHtml(field) {
    let html = field.getHtml();

    const wrapperCssClass = this.options.wrapperCssClass;

    html = `<div class="${wrapperCssClass}">${html}</div>`;

    const $ = cheerio.load(html, { decodeEntities: false });

    // Kentico Cloud can return an empty paragraph element if there is no content, which is of no use
    // If the rich text element has no text content, just return an empty string

    if ($(`.${wrapperCssClass}`).text().trim() === '') {
      return '';
    }

    // Resolve item links
    // N.B. This shouldn't be necessary, but the `linkResolver` feature of the Kentico Cloud SDK doesn't appear to work

    this.parseItemLinks(field, $);

    // Unwrap components

    this.parseComponents(field, $);

    // Resolve assets

    this.parseAssets(field, $);

    // Return the parsed html

    html = cheerio.html($(`.${wrapperCssClass}`), { decodeEntities: false });

    return html;
  }

  parseComponents(field, $) {
    const componentSelector = this.options.componentSelector;
    const components = $(componentSelector);

    components.each((index, element) => {
      const component = $(element);

      const componentHtml = component.html();

      component.replaceWith(componentHtml);
    });
  }

  getComponentHtml(type, id, codename) {
    // Rich text components will be rendered as Vue components

    const componentName = changeCase.kebabCase(type);

    const html = `<${componentName} id="${id}" codename="${codename}" />`;

    return html;
  }

  parseItemLinks(field, $) {
    const itemLinkSelector = this.options.itemLinkSelector;
    const itemLinks = $(itemLinkSelector);
    const links = field.links;

    itemLinks.each((index, element) => {
      const itemLink = $(element);
      const itemId = itemLink.data('itemId');
      const link = links.filter(l => l.linkId === itemId)[0];
      const typeName = this.typeNameResolver(link.type);
      const linkText = itemLink.html();

      const itemLinkHtml = this.getLinkHtml(itemId, typeName, linkText);

      itemLink.replaceWith(itemLinkHtml);
    });
  }

  getLinkHtml(id, typeName, text) {
    // Links to content items in rich text fields will be rendered as Vue components

    // TODO: Generate component name based on type name set in options
    const html = `<item-link id="${id}" type="${typeName}">${text}</item-link>`;

    return html;
  }

  parseAssets(field, $) {
    const assetSelector = this.options.assetSelector;
    const assets = $(assetSelector);

    assets.each((index, element) => {
      const asset = $(element);
      const assetImg = asset.find('img');

      if (assetImg.length === 0) {
        // TODO: What to do with other types of assets? Currently the
        // id of an asset node is the url, but where do we get that from?

        return;
      }

      const assetId = assetImg.attr('src');

      // TODO: The asset id is available in the `data-asset-id` attribute, but
      // the url is currently used as the Gridsome node id because the id is not
      // available in asset data retrieved via the delivery API - the below will
      // need to change if/when the id is made avaiable

      const assetHtml = this.getAssetHtml(assetId);

      asset.replaceWith(assetHtml);
    });
  }

  getAssetHtml(id) {
    // Assets will be rendered as Vue components

    // TODO: Generate component name based on type name set in options
    const html = `<asset id="${id}" />`;

    return html;
  }
}

module.exports = GridsomeRichTextHtmlParser;
