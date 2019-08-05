<template>
  <v-lazy-image
    :src="src"
    :src-placeholder="srcPlaceholder"
    :alt="alt"
  />
</template>

<script>
import VLazyImage from 'v-lazy-image';

export default {
  components: {
    VLazyImage
  },
  props: {
    src: {
      type: String,
      required: true
    },
    srcPlaceholder: {
      type: String,
      required: false,
      default: ''
    },
    alt: {
      type: String,
      required: false,
      default: ''
    }
  }
};
</script>

<style scoped>
img {
   width: 100%;
}

.v-lazy-image {
  filter: blur(5px);
  transition: filter 1.6s;
  will-change: filter;
}

.v-lazy-image-loaded {
  filter: blur(0);
}
</style>
