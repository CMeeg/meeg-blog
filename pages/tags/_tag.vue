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
      <article-list :with-tag="tag" />
    </max-width-container>
  </main>
</template>

<script>
import ArticleList from '~/components/blog/ArticleList.vue'

export default {
  components: {
    ArticleList
  },
  data() {
    return {
      tag: this.$route.params.tag
    }
  }
}
</script>
