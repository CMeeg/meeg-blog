<template>
  <v-runtime-template :template="html" />
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template';
import ItemLink from '~/components/kentico-cloud/rich-text/ItemLink.vue';
import Asset from '~/components/kentico-cloud/rich-text/Asset.vue';
import CodeSnippet from '~/components/kentico-cloud/rich-text/CodeSnippet.vue';

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
  }
};
</script>
