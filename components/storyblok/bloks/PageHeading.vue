<template>
  <div v-editable="blok">
    <h1>{{ blok.title }}</h1>

    <field-rich-text :doc="blok.intro" />
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
