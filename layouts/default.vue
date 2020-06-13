<template>
  <div>
    <default-header />
    <main role="main">
      <nuxt />
    </main>
    <default-footer />
  </div>
</template>

<script>
import DefaultHeader from '~/components/layout/DefaultHeader.vue'
import DefaultFooter from '~/components/layout/DefaultFooter.vue'

export default {
  components: {
    DefaultHeader,
    DefaultFooter
  }
}
</script>
