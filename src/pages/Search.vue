<template>
  <layout>
    <h1>{{ pageNode.title }}</h1>
  </layout>
</template>

<script>
import metadata from '~/mixins/Metadata';

export default {
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return {
        title: 'Search'
      }
    }
  }
}
</script>
