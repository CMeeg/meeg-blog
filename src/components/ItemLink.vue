<template>
  <g-link :to="itemLink.path">
    <slot />
  </g-link>
</template>

<static-query>
query ItemLink {
    itemLinks: allItemLink {
        edges {
            node {
                id,
                typeName,
                path
            }
        }
    }
}
</static-query>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    itemLink() {
      const itemLink = this.$static.itemLinks.edges.filter(
        edge => edge.node.id === this.id && edge.node.typeName === this.type
      );

      if (itemLink.length === 1) {
        return itemLink[0].node;
      }

      return null;
    }
  }
};
</script>
