<template>
  <component :is="assetComponent.name" v-bind="assetComponent.props" />
</template>

<static-query>
query Asset {
  assets: allAsset {
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
}
</static-query>

<script>
import LazyImage from '~/components/LazyImage.vue';

export default {
  components: {
    LazyImage
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    asset: function() {
      const asset = this.$static.assets.edges.filter(
        edge => edge.node.id === this.id
      );

      if (asset.length === 1) {
        return asset[0].node;
      }

      return null;
    },
    assetComponent: function () {
      switch (this.asset.type) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/webp':
          return {
            name: 'lazy-image',
            props: {
              src: this.asset.url,
              srcPlaceholder: this.asset.placeholderUrl,
              alt: this.asset.description
            }
          };
      }

      return {
        template: `<p><a href="${this.asset.url}">${this.asset.name}</a></p>`
      };
    }
  }
};
</script>
