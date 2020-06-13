<template>
  <div v-editable="blok" class="page">
    <component
      :is="bodyBlok.component | dashify"
      v-for="bodyBlok in blok.body"
      :key="bodyBlok._uid"
      :blok="bodyBlok"
    />
  </div>
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
