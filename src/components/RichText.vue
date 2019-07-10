<template>
    <v-runtime-template :template="html" />
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import ItemLink from "~/components/ItemLink.vue";
import CodeSnippet from "~/components/CodeSnippet.vue";

export default {
    props: [
        'html'
    ],
    components: {
        VRuntimeTemplate,
        ItemLink,
        CodeSnippet
    }
}
</script>

<style>

</style>
