const GridsomeContentItem = require('../GridsomeContentItem');

class Article extends GridsomeContentItem {
  addFields(node) {
    super.addFields(node);

    this.ensureDateField(node);

    this.ensureLastUpdatedField(node);

    this.setSortDateField(node);

    return node;
  }

  ensureDateField(node) {
    const articleDate = new Date(node.item.date1);
    const lastModified = new Date(node.item.date);

    // If a date has been provided, use it instead of the
    // system date

    if (!this.isNullDate(articleDate)) {
      node.item.date = articleDate;
    }

    // Update other date related field values

    node.item.lastModified = lastModified;
    node.item.date1 = undefined;
  }

  ensureLastUpdatedField(node) {
    // If set, the last updated date cannot be greater than the published date

    const lastUpdated = node.item.lastUpdated;

    if (this.isNullDate(lastUpdated)) {
      node.item.hasUpdates = false;

      return;
    }

    node.item.hasUpdates = true;

    const date = node.item.date;

    if (lastUpdated.getTime() < date.getTime()) {
      return;
    }

    node.item.lastUpdated = date;
  }

  setSortDateField(node) {
    const date = node.item.date;
    const lastUpdated = node.item.lastUpdated;

    const value = lastUpdated.getTime() > date.getTime() ? lastUpdated : date;

    this.addField(node, 'sortDate', value);
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
