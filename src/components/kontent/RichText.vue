<template>
  <v-runtime-template :template="html" />
</template>

<static-query>
query RichText {
  item_link: allItemLink {
    edges {
      node {
        id,
        typeName,
        path
      }
    }
  }

  asset: allAsset {
    edges {
      node {
        id,
        name,
        url(width: 1200, format: "webp"),
        placeholderUrl: url(width: 50, format: "webp"),
        type,
        size,
        description,
        width,
        height
      }
    }
  }

  code_snippet: allCodeSnippet {
    edges {
      node {
        id,
        codename,
        code,
        language {
          name
        }
      }
    }
  }
}
</static-query>

<script>
import VRuntimeTemplate from 'v-runtime-template';
import ItemLink from '~/components/kontent/rich-text/ItemLink.vue';
import Asset from '~/components/kontent/rich-text/Asset.vue';
import CodeSnippet from '~/components/kontent/rich-text/CodeSnippet.vue';

export default {
  components: {
    VRuntimeTemplate,
    /* eslint-disable vue/no-unused-components */
    ItemLink,
    Asset,
    CodeSnippet
    /* eslint-enable vue/no-unused-components */
  },
  props: {
    html: {
      type: String,
      required: true
    }
  },
  methods: {
    getNode: function(codename, id) {
      const query = this.$static[codename];

      if (typeof(query) === 'undefined') {
        return null;
      }

      const edges = query.edges.filter(
        edge => edge.node.id === id
      );

      if (edges.length === 1) {
        return edges[0].node;
      }

      return null;
    }
  }
};
</script>
