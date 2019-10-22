<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<static-query>
query {
  metadata {
    siteName
    siteDescription
  }
}
</static-query>

<script>
import DefaultLayout from '~/layouts/Default.vue';

export default {
  components: {
    DefaultLayout
  },
  metaInfo() {
    return {
      title: this.$static.metadata.siteName,
      meta: [
        {
          key: 'description',
          name: 'description',
          content: this.$static.metadata.siteDescription
        }
      ]
    }
  }
}
</script>
