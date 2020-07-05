<template>
  <main role="main">
    <page-heading>
      <template v-slot:title>
        {{ title }}
      </template>
      <template v-slot:intro>
        <div class="content-block">
          <p v-if="statusCode === 404">
            Please try taking a look at my
            <nuxt-link to="/blog">articles</nuxt-link>,
            <nuxt-link to="/tags">tags</nuxt-link> or
            <nuxt-link to="/">home page</nuxt-link> instead.
          </p>
          <p v-else>
            Please go back and try again or try taking a look at my
            <nuxt-link to="/blog">articles</nuxt-link>,
            <nuxt-link to="/tags">tags</nuxt-link> or
            <nuxt-link to="/">home page</nuxt-link> instead.
          </p>
          <p v-if="message">{{ message }}</p>
        </div>
      </template>
    </page-heading>
  </main>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    statusCode() {
      return this.error?.statusCode || 500
    },
    title() {
      return this.statusCode === 404
        ? 'Page not found'
        : 'Sorry, an error has occurred'
    },
    message() {
      if (this.isDev) {
        return this.error?.message || 'An unknown error has occured'
      }

      return null
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
