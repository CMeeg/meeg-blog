<template>
  <page-heading v-editable="blok">
    <template v-slot:title>
      {{ blok.title }}
    </template>

    <template v-slot:intro>
      <field-rich-text :doc="blok.intro" />
    </template>
  </page-heading>
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
