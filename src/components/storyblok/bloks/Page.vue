<template>
  <div v-editable="blok">
    <field-blocks :blocks="blok.body" />
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
