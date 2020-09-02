<template>
  <div>
    <blok v-for="blok in blocks" :key="blok._uid" :blok="blok" />
  </div>
</template>

<script>
export default {
  props: {
    blocks: {
      type: Array,
      required: true
    }
  }
}
</script>
