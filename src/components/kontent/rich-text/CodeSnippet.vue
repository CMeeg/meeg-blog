<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="node.highlightedCode" />
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      required: true
    }
  }
};
</script>
