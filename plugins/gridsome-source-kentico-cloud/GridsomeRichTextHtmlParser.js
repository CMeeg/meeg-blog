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

    // Kentico Cloud can return empty an empty paragrpah element if there is no content, which is of no use
    // If the rich text element has no text content, just return an empty string

    if ($(`.${wrapperCssClass}`).text().trim() === '') {
      return '';
    }

    // Resolve item links
    // N.B. This shouldn't be necessary, but the `linkResolver` feature of the Kentico Cloud SDK doesn't appear to work

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

    // Unwrap components

    const componentSelector = this.options.componentSelector;
    const components = $(componentSelector);

    components.each((index, element) => {
      const component = $(element);

      const componentHtml = component.html();

      component.replaceWith(componentHtml);
    });

    html = cheerio.html($(`.${wrapperCssClass}`), { decodeEntities: false });

    return html;
  }

  getComponentHtml(type, id, codename) {
    // Rich text components will be rendered as Vue components

    const componentName = changeCase.kebabCase(type);

    const html = `<${componentName} id="${id}" codename="${codename}" />`;

    return html;
  }

  getLinkHtml(id, typeName, text) {
    // Links to content items in rich text fields will be rendered as Vue components

    const html = `<item-link id="${id}" type="${typeName}">${text}</item-link>`;

    return html;
  }
}

module.exports = GridsomeRichTextHtmlParser;
