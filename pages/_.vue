<template>
  <main role="main">
    <component
      :is="story.content.component | dashify"
      v-if="story.content.component"
      :key="story.content._uid"
      :blok="story.content"
    />
  </main>
</template>

<script>
export default {
  async asyncData(context) {
    const path = context.route.path === '/' ? 'home' : context.route.path

    const page = await context.app.$storyblok().get(path)

    if (page.story.content.component === 'article_series') {
      // `article_series` has to be a content type, but it's not a "page"
      context.error({
        statusCode: 404,
        message: 'Page not found'
      })
    }

    return page
  },
  data() {
    return {
      story: {
        content: {}
      }
    }
  },
  mounted() {
    this.$storyblok().reloadOnChange(this.story)
  }
}
</script>
