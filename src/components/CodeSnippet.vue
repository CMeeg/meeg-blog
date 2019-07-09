<template>
    <p class="code-snippet">
        <pre>{{ codeSnippet.code }}</pre>
    </p>
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
    props: [
        'id',
        'codename',
        'type'
    ],
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
}
</script>

<style>

</style>
