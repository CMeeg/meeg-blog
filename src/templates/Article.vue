<template>
  <layout>
    <h1>{{ pageNode.title }} </h1>

    <p>Posted <time :datetime="pageNode.date">{{ pageNode.date }}</time></p>

    <card v-if="pageNode.hasUpdates">
      <h2 slot="header">This article has been updated</h2>

      <div slot="body">
        <p>Updated <time :datetime="pageNode.lastUpdated">{{ pageNode.lastUpdated }}</time></p>

        <rich-text :html="pageNode.changeLog" />
      </div>
    </card>

    <card v-for="series in pageNode.series.edges" :key="series.node.id">
      <h2 slot="header">This article is a part of the series: <g-link :to="series.node.path">{{ series.node.title }}</g-link></h2>
      <div slot="body">
        <ol>
          <li v-for="article in series.node.articlesInSeries" :key="article.id">
            <g-link :to="article.path">{{ article.title }}</g-link>
          </li>
        </ol>
      </div>
    </card>

    <rich-text :html="pageNode.body" />

    <tag-list :tags="pageNode.tag" />
  </layout>
</template>

<page-query>
query Article ($id: ID!) {
  article (id: $id) {
    title,
    date,
    hasUpdates,
    lastUpdated,
    changeLog,
    body,
    tag {
      id,
      name,
      path
    },
    author {
      path
    },
    path,
    pageMetadataMetaTitle,
    pageMetadataMetaDescription,
    pageMetadataOpenGraphTitle,
    pageMetadataOpenGraphDescription,
    pageMetadataOpenGraphImage {
      url,
      description
    },
    series: belongsTo {
      edges {
        node {
          ... on ArticleSeries {
            id,
            title,
            articlesInSeries {
              id,
              title,
              path
            },
            path
          }
        }
      }
    }
  }
}
</page-query>

<script>
import Card from '~/components/Card.vue';
import RichText from '~/components/kontent/RichText.vue';
import TagList from '~/components/tags/TagList.vue';
import metadata from '~/mixins/Metadata';
import appConfig from '~/app.config.js';

export default {
  components: {
    Card,
    RichText,
    TagList
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return this.$page.article;
    }
  },
  methods: {
    getPageMetaInfo: function() {
      const node = this.pageNode;
      const metaInfo = {};

      this.addArticleMetaInfo(metaInfo, node);

      return metaInfo;
    },
    addArticleMetaInfo: function(metaInfo, node) {
      metaInfo.htmlAttrs = {
        prefix: 'article: http://ogp.me/ns/article#'
      };

      this.addMetaItems(metaInfo, [
        { name: 'og:type', content: 'article' },
        { name: 'article:published_time', content: node.date },
        { name: 'article:modified_time', content: node.hasUpdates ? node.lastUpdated : null }
      ]);

      for (const author of node.author) {
        this.addMetaItem(metaInfo, { name: 'article:author', content: appConfig.getSiteUrl(author.path) });
      }

      for (const tag of node.tag) {
        this.addMetaItem(metaInfo, { name: 'article:tag', content: tag.name });
      }
    }
  }
}
</script>
