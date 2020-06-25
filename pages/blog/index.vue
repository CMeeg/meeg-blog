<template>
  <main role="main">
    <field-blocks :blocks="story.content.body" />

    <max-width-container>
      <article-list :starts-with="$route.path.substr(1)" />
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
  }
}
</script>
