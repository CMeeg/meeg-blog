<template>
  <main role="main">
    <field-blocks :blocks="story.content.body" />
  </main>
</template>

<script>
export default {
  asyncData(context) {
    const path = 'home'

    const storyblok = context.app.$storyblok()

    const story = storyblok.get(path)

    const articles = storyblok.getAll({
      starts_with: 'blog/',
      is_startpage: 0,
      sort_by: 'sort_by_date:desc',
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
