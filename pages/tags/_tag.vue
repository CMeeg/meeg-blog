<template>
  <main role="main">
    <page-heading>
      <template v-slot:title>{{ tag }}</template>
      <template v-slot:intro>
        <div class="content-block">
          <p>
            Articles about <i>{{ tag }}</i> can be found below.<br />
            <nuxt-link :to="{ name: 'tags' }">See all tags</nuxt-link>
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
