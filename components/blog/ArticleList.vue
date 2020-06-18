<template>
  <div class="mx-auto px-6 pb-8 max-w-6xl">
    <div class="gap-6 grid grid-rows-none md:grid-cols-3">
      <article-card
        v-for="article in articles.stories"
        :key="article._uid"
        :article="article"
      />
    </div>
  </div>
</template>

<script>
import ArticleCard from '~/components/blog/ArticleCard.vue'

export default {
  components: {
    ArticleCard
  },
  props: {
    articles: {
      type: Object,
      required: true
    }
  }
}
</script>
