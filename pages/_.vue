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
  asyncData(context) {
    const path = context.route.path === '/' ? 'home' : context.route.path

    return context.app.$storyblok().get(path)
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
