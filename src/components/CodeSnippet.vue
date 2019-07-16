<template>
  <pre class="code-snippet">{{ codeSnippet.code }}</pre>
</template>

<static-query>
query CodeSnippet {
  codeSnippets: allLinkedItem(filter: { typeName: { eq: "CodeSnippet" }}) {
    edges {
      node {
        codename,
        code,
        language
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
    codeSnippet() {
      const codeSnippet = this.$static.codeSnippets.edges.filter(
        edge => edge.node.codename === this.codename
      );

      if (codeSnippet.length === 1) {
        return codeSnippet[0].node;
      }

      return null;
    }
  }
};
</script>
