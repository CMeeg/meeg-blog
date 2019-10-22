<template>
  <component :is="assetComponent.name" v-bind="assetComponent.props" />
</template>

<script>
import LazyImage from '~/components/LazyImage.vue';

export default {
  components: {
    LazyImage
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  computed: {
    assetComponent: function () {
      switch (this.node.type) {
        case 'image/gif':
        case 'image/jpeg':
        case 'image/png':
        case 'image/webp':
          return {
            name: 'lazy-image',
            props: {
              src: this.node.url,
              srcPlaceholder: this.node.placeholderUrl,
              alt: this.node.description
            }
          };
      }

      return {
        template: `<p><a href="${this.node.url}">${this.node.name}</a></p>`
      };
    }
  }
};
</script>
