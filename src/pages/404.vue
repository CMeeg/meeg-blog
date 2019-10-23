<template>
  <div>
    <h1>{{ pageNode.title }}</h1>
  </div>
</template>

<script>
import metadata from '@/mixins/Metadata';

export default {
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return {
        title: 'Page not found',
        url: '/404/'
      }
    }
  }
}
</script>
