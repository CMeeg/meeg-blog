<template>
    <v-runtime-template :template="template" />
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import CodeSnippet from "~/components/CodeSnippet.vue";

export default {
    props: [
        'html'
    ],
    data () {
        return {
            template: this.html
        }
    },
    components: {
        VRuntimeTemplate,
        CodeSnippet
    }
}
</script>

<style>

</style>
