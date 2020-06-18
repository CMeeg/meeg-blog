<template>
  <main role="main">
    <field-blocks :blocks="story.content.body" />

    <div class="mx-auto px-6 pb-8 max-w-6xl">
      <div class="gap-6 grid grid-rows-none md:grid-cols-3">
        <article-card
          v-for="article in articles.stories"
          :key="article._uid"
          :article="article"
        />
      </div>
    </div>
  </main>
</template>

<script>
import ArticleCard from '~/components/blog/ArticleCard.vue'

export default {
  components: {
    ArticleCard
  },
  asyncData(context) {
    const storyblok = context.app.$storyblok()

    const story = storyblok.get('home')

    const articles = storyblok.getAll({
      starts_with: 'blog/',
      is_startpage: 0,
      sort_by: 'first_published_at:desc',
      per_page: 3
    })

    return Promise.all([story, articles]).then(results => {
      return {
        ...results[0],
        articles: {
          ...results[1]
        }
      }
    })
  },
  data() {
    return {
      story: {
        content: {}
      },
      articles: {
        total: 0,
        stories: []
      }
    }
  },
  mounted() {
    this.$storyblok().reloadOnChange(this.story)
  }
}
</script>
