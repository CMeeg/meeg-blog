<template>
  <node-list :nodes="tags">
    <article-summary slot="node" slot-scope="{ node }" :article="node" />
    <g-link slot="node" slot-scope="{ node }" :to="node.path">{{ getTagText(node) }}</g-link>
  </node-list>
</template>

<script>
import NodeList from '~/components/NodeList.vue';

export default {
  components: {
    NodeList
  },
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
