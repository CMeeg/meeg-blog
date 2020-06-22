<template>
  <div class="app">
    <app-header />
    <nuxt keep-alive />
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppFooter
  }
}
</script>
