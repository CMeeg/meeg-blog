<template>
  <ul v-if="tagNodes.length">
    <li v-for="tag in tagNodes" :key="tag.id">
      <g-link :to="tag.path">{{ getTagText(tag) }}</g-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true
    },
    displayAsCloud: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    tagNodes: function() {
      return this.tags.map(tag => {
        if (typeof(tag.node) !== 'undefined') {
          return tag.node;
        }

        return tag;
      });
    }
  },
  methods: {
    getTagText(tag) {
      if (this.displayAsCloud) {
        return `${tag.name} (${tag.belongsTo.totalCount})`;
      }

      return tag.name;
    }
  }
}
</script>
