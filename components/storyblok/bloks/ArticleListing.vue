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
export default {
  props: {
    blok: {
      type: Object,
      required: true
    }
  }
}
</script>
