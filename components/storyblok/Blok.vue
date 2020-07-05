<template>
  <component :is="blok.component | dashify" :blok="blok" />
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
