<template>
  <main role="main">
    <field-blocks :blocks="story.content.body" />

    <max-width-container>
      <article-list starts-with="blog/" :per-page="3" />
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
    return context.app.$storyblok().get('home')
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
