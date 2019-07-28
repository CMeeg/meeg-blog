const GridsomeContentItem = require('../GridsomeContentItem');

class Article extends GridsomeContentItem {
  addFields(node) {
    super.addFields(node);

    this.ensurePublishedDate(node);

    this.ensureLastUpdatedDate(node);

    return node;
  }

  ensurePublishedDate(node) {
    // If a date has been provided, use it, otherwise;
    // use the last modified date as that is always set

    let publishedDate = node.item.date;

    if (this.isNullDate(publishedDate)) {
      publishedDate = node.item.lastModified;
    }

    node.item.publishedDate = publishedDate;
  }

  ensureLastUpdatedDate(node) {
    // If set, the last updated date cannot be greater than the published date

    const lastUpdated = node.item.lastUpdated;

    if (this.isNullDate(lastUpdated)) {
      return;
    }

    const publishedDate = node.item.publishedDate;

    if (lastUpdated.getTime() < publishedDate.getTime()) {
      return;
    }

    node.item.lastUpdated = publishedDate;
  }

  isNullDate(date) {
    if (typeof(date) === 'undefined') {
      return true;
    }

    if (date === null) {
      return true;
    }

    // If a date value is null in Kentico Cloud it can be parsed as a zero UTC date

    return date.getTime() === 0;
  }
}

module.exports = Article;
