<template>
  <div v-editable="blok" class="util__flex-eq">
    <h1>{{ blok.name }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    blok: {
      type: Object,
      required: true
    }
  }
}
</script>
