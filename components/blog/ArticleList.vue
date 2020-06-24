<template>
  <div
    :class="$fetchState.error ? '' : 'md:grid-cols-3'"
    class="mb-6 gap-6 grid grid-rows-none"
  >
    <template v-if="$fetchState.pending">
      <card v-for="index in 3" :key="index">
        <template v-slot:header>
          <content-placeholders>
            <content-placeholders-heading />
          </content-placeholders>
        </template>
        <template v-slot:body>
          <content-placeholders>
            <content-placeholders-text :lines="2" />
          </content-placeholders>
        </template>
      </card>
    </template>
    <template v-else-if="$fetchState.error">
      <message-box type="error">
        <div class="content-block">
          <p>
            <em>{{ $fetchState.error.message }}</em>
          </p>
        </div>
      </message-box>
    </template>
    <template v-else>
      <article-card
        v-for="article in articles.stories"
        :key="article._uid"
        :article="article"
      />
    </template>
  </div>
</template>

<script>
import ArticleCard from '~/components/blog/ArticleCard.vue'

export default {
  components: {
    ArticleCard
  },
  props: {
    startsWith: {
      type: String,
      required: false,
      default: null
    },
    withTag: {
      type: String,
      required: false,
      default: null
    },
    perPage: {
      type: Number,
      required: false,
      default: 12
    }
  },
  async fetch() {
    const articlesQuery = {
      is_startpage: 0,
      sort_by: 'first_published_at:desc',
      per_page: this.perPage
    }

    if (this.startsWith) {
      articlesQuery.starts_with = this.startsWith
    }

    if (this.withTag) {
      articlesQuery.with_tag = this.withTag
    }

    const articles = await this.$storyblok().getAll(articlesQuery)

    if (!articles || articles.total === 0) {
      throw new Error('No articles found. Please refresh and try again.')
    }

    this.articles = articles.stories
  },
  data() {
    return {
      articles: {
        total: 0,
        stories: []
      }
    }
  }
}
</script>
