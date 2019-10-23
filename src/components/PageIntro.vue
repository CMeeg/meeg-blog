<template>
  <div class="mt-4 mb-6">
    <h1 v-if="title" class="font-cursive text-4xl mb-2">{{ title }}</h1>
    <slot name="body" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>
