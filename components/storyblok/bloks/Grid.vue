<template>
  <div v-editable="blok" class="util__flex">
    <component
      :is="columnBlok.component | dashify"
      v-for="columnBlok in blok.columns"
      :key="columnBlok._uid"
      :blok="columnBlok"
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
