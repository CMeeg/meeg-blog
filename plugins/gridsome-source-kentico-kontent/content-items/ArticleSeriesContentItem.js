const { GridsomeContentItem } = require('@meeg/gridsome-source-kentico-kontent');

class ArticleSeriesContentItem extends GridsomeContentItem {
  addFields(node) {
    super.addFields(node);

    this.setLastUpdatedField(node);

    return node;
  }

  setLastUpdatedField(node) {
    const articleLastUpdated = node.linkedItemFields
      .filter(field => field.fieldName === 'articlesInSeries')
      .map(field => this.getArticleLastUpdated(field.linkedItems));

    const value = articleLastUpdated[0];

    this.addField(node, 'lastUpdated', value);
  }

  getArticleLastUpdated(articles) {
    const articleDates = articles
      .map(article => {
        const node = article.createNode();
        const sortDate = node.item.sortDate;

        return sortDate;
      })
      .reduce((prevDate, currentDate) => {
        return prevDate > currentDate ? prevDate : currentDate
      });

    return articleDates;
  }
}

module.exports = ArticleSeriesContentItem;
