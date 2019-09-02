<template>
  <pre class="code-snippet">{{ node.code }}</pre>
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
