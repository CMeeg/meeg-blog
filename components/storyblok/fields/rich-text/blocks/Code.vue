<template>
  <highlight-code :lang="lang" :auto="auto">
    <slot />
  </highlight-code>
</template>

<script>
export default {
  name: 'SbCodeBlock',
  props: {
    attrs: {
      type: Object,
      required: true
    }
  },
  computed: {
    lang() {
      const lang = this.attrs.class.replace('language-', '')

      return this.$codeHighlighter().isSupportedLanguage(lang) ? lang : ''
    },
    auto() {
      return this.lang === ''
    }
  }
}
</script>
