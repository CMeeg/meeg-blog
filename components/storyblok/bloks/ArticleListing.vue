<template>
  <max-width-container v-editable="blok">
    <article-list
      :starts-with="blok.starts_with"
      :with-tag="blok.with_tag"
      :per-page="parseInt(blok.per_page)"
    />
  </max-width-container>
</template>

<script>
import ArticleList from '~/components/blog/ArticleList.vue'

export default {
  components: {
    ArticleList
  },
  props: {
    blok: {
      type: Object,
      required: true
    }
  }
}
</script>
