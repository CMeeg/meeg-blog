<template>
  <rich-text-renderer v-if="doc" :document="doc" />
</template>

<script>
export default {
  props: {
    doc: {
      type: Object,
      required: true
    }
  }
}
</script>
