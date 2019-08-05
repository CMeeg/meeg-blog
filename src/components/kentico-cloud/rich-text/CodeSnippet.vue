<template>
  <pre class="code-snippet">{{ codeSnippet.code }}</pre>
</template>

<static-query>
query CodeSnippet {
  codeSnippets: allCodeSnippet {
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
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    codename: {
      type: String,
      required: true
    }
  },
  computed: {
    codeSnippet: function() {
      const codeSnippet = this.$static.codeSnippets.edges.filter(
        edge => edge.node.id === this.id
      );

      if (codeSnippet.length === 1) {
        return codeSnippet[0].node;
      }

      return null;
    }
  }
};
</script>
