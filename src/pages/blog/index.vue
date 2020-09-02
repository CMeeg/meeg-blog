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
    return context.app.$storyblok().get(context.route.path)
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
  },
  head() {
    return this.$metadata().getMetadata(this.story.content.metadata)
  }
}
</script>
