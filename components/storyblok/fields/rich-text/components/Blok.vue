<template>
  <blok :blok="blok" />
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    body: {
      type: Object,
      required: true
    }
  },
  setup({ body }) {
    const blok = ref(body)

    return {
      blok
    }
  }
})
</script>
