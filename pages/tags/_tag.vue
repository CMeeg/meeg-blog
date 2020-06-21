<template>
  <main role="main">
    <page-heading>
      <template v-slot:title>{{ tag }}</template>
      <template v-slot:intro>
        <div class="content-block">
          <p>
            <!-- eslint-disable -->
            All articles <nuxt-link :to="{ name: 'tags' }">tagged</nuxt-link> with
            <i>{{ tag }}</i> can be found below...
            <!-- eslint-enable -->
          </p>
        </div>
      </template>
    </page-heading>

    <max-width-container>
      <article-list :articles="stories" />
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
    const tag = context.route.params.tag

    const storyblok = context.app.$storyblok()

    return storyblok.getAll({
      with_tag: tag,
      is_startpage: 0,
      sort_by: 'first_published_at:desc',
      per_page: 12
    })
  },
  data() {
    return {
      tag: this.$route.params.tag,
      stories: {
        total: 0,
        stories: []
      }
    }
  }
}
</script>
