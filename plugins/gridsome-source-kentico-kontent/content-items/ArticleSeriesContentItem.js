const { GridsomeContentItem } = require('@meeg/gridsome-source-kentico-kontent');

class ArticleSeriesContentItem extends GridsomeContentItem {
  async addFields(node) {
    await super.addFields(node);

    await this.setLastUpdatedField(node);

    return node;
  }

  async setLastUpdatedField(node) {
    const articleInSeriesFields = node.linkedItemFields
      .filter(field => field.fieldName === 'articlesInSeries');

    const articleLastUpdated = await Promise.all(
      articleInSeriesFields.map(async field => this.getArticleLastUpdated(field.linkedItems))
    );

    const value = articleLastUpdated[0];

    this.addField(node, 'lastUpdated', value);
  }

  async getArticleLastUpdated(articles) {
    const articleDates = await Promise.all(
      articles.map(async article => {
        const node = await article.createNode();
        const sortDate = node.item.sortDate;

        return sortDate;
      })
    );

    const sortedArticleDates = articleDates.reduce((prevDate, currentDate) => {
      return prevDate > currentDate ? prevDate : currentDate
    });

    return sortedArticleDates;
  }
}

module.exports = ArticleSeriesContentItem;
