<template>
  <div class="mb-6">
    <template v-if="$fetchState.pending">
      <message-box type="info">
        <div class="content-block">
          <p>Fetching articles in series</p>
        </div>
      </message-box>
    </template>
    <template v-else-if="$fetchState.error">
      <message-box type="error">
        <div class="content-block">
          <p>{{ $fetchState.error.message }}</p>
        </div>
      </message-box>
    </template>
    <template v-else>
      <aside id="series">
        <card>
          <template v-slot:header>
            <p class="mb-2 text-gray-500 text-xs uppercase">
              This article is part of a series
            </p>
            <h2 class="mb-2 font-serif leading-6 text-2xl">
              {{ series.content.title }}
            </h2>
          </template>
          <template v-slot:body>
            <field-rich-text :doc="series.content.summary" />

            <div class="content-block text-sm">
              <ol v-if="articles.total > 0">
                <li v-for="article in articles.stories" :key="article.uuid">
                  <p>
                    <nuxt-link
                      v-if="article.uuid !== currentArticleId"
                      :to="article.full_slug | rootRelative"
                      class="text-green-400 focus:underline focus:outline-none hover:underline"
                    >
                      {{ article.content.title }}
                    </nuxt-link>
                    <i v-else class="text-gray-300">
                      (This article) {{ article.content.title }}
                    </i>
                  </p>
                </li>
              </ol>
            </div>
          </template>
        </card>
      </aside>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    story: {
      type: Object,
      required: true
    }
  },
  async fetch() {
    const articles = await this.$storyblok().getAll({
      sort_by: 'first_published_at:desc',
      filter_query: {
        series: {
          in: this.series.uuid
        }
      }
    })

    if (!articles) {
      throw new Error(
        'There was a problem retrieving articles in this series. Please refresh and try again.'
      )
    }

    this.articles = articles.stories
  },
  data() {
    return {
      series: this.story.content.series,
      articles: {
        total: 0,
        stories: []
      },
      currentArticleId: this.story.uuid
    }
  }
}
</script>
