<template>
  <div>
    <component
      :is="story.content.component | dashify('story')"
      v-if="story.content.component"
      :key="story.content._uid"
      :story="story"
    />
  </div>
</template>

<script>
export default {
  asyncData(context) {
    const path = context.route.path === '/' ? 'home' : context.route.path

    return context.app.$storyblok().get(path)
  },
  data() {
    return {
      story: { content: {} }
    }
  },
  mounted() {
    this.$storyblok().reloadOnChange(this.story)
  }
}
</script>
