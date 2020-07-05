<template>
  <img :src="src" />
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      required: true
    },
    options: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    src: function() {
      const filename = this.field.filename
      const imageService = 'https://img2.storyblok.com'
      const path = filename.replace('https://a.storyblok.com/', '')

      if (this.options === '') {
        return `${imageService}/${path}`
      }

      return `${imageService}/${this.options}/${path}`
    }
  }
}
</script>
