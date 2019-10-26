<template>
  <div>
    <page-intro :title="pageNode.title">
      <div slot="body">
        <p class="text-gray-600 mb-6 flex align-middle">
          <svg class="stroke-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <time :datetime="pageNode.lastUpdated" class="pl-2">{{ new Date(pageNode.lastUpdated).toDateString() }}</time>
        </p>
      </div>
    </page-intro>

    <div class="font-serif italic md:text-lg leading-tight mb-6">
      <rich-text :html="pageNode.summary" />
    </div>

    <article-summary-list :articles="articles" />
  </div>
</template>

<page-query>
query ArticleSeries ($id: ID!) {
  articleSeries (id: $id) {
    title,
    summary,
    articlesInSeries {
      title,
      summary,
      tag {
        id,
        name,
        path
      },
      path,
      date,
      lastUpdated
    },
    path,
    lastUpdated,
    pageMetadataMetaTitle,
    pageMetadataMetaDescription,
    pageMetadataOpenGraphTitle,
    pageMetadataOpenGraphDescription,
    pageMetadataOpenGraphImage {
      url,
      description
    }
  }
}
</page-query>

<script>
import PageIntro from '@/components/PageIntro.vue';
import RichText from '@/components/kontent/RichText.vue';
import ArticleSummaryList from '@/components/articles/ArticleSummaryList.vue';
import metadata from '@/mixins/Metadata';

export default {
  components: {
    PageIntro,
    RichText,
    ArticleSummaryList
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return this.$page.articleSeries;
    },
    articles: function() {
      return {
        edges: this.pageNode.articlesInSeries.map(article => {
          return {
            node: article
          };
        })
      };
    }
  }
}
</script>
