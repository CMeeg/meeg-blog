<template>
  <main role="main">
    <field-blocks :blocks="story.content.body" />

    <max-width-container>
      <article-list :articles="articles" />
    </max-width-container>
  </main>
</template>

<script>
import ArticleList from '~/components/blog/ArticleList.vue'

export default {
  components: {
    ArticleList
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
