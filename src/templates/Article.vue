<template>
  <div>
    <page-intro :title="pageNode.title">
      <div slot="body">
        <p class="text-gray-600 mb-2 flex align-middle">
          <svg class="stroke-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <time :datetime="pageNode.date" class="pl-2">{{ new Date(pageNode.date).toDateString() }}</time>
        </p>

        <div class="mb-6 flex align-middle">
          <svg class="flex-shrink-0 stroke-current text-gray-600 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <tag-list :tags="pageNode.tag" list-class="flex flex-wrap justify-start pl-2" :show-tag-icon="false" />
        </div>
      </div>
    </page-intro>

    <card v-for="series in pageNode.series.edges" :key="series.node.id">
      <h2 slot="header" class="font-cursive text-base md:text-lg mb-2">This article is part of the series: <g-link :to="series.node.path">{{ series.node.title }}</g-link></h2>
      <div slot="body">
        <ol class="list-decimal list-outside ml-4">
          <li v-for="article in series.node.articlesInSeries" :key="article.id" class="mb-1">
            <g-link :to="article.path">{{ article.title }}</g-link>
          </li>
        </ol>
      </div>
    </card>

    <card v-if="pageNode.hasUpdates">
      <h2 slot="header" class="font-cursive text-base md:text-lg mb-2">This article has been updated</h2>

      <div slot="body">
        <div class="text-sm md:text-base">
          <rich-text :html="pageNode.changeLog" />
        </div>
      </div>
    </card>

    <rich-text :html="pageNode.body" />
  </div>
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
import PageIntro from '@/components/PageIntro.vue';
import Card from '@/components/Card.vue';
import RichText from '@/components/kontent/RichText.vue';
import TagList from '@/components/tags/TagList.vue';
import metadata from '@/mixins/Metadata';
import appConfig from '@/app.config.js';

export default {
  components: {
    PageIntro,
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
