<template>
  <div>
    <field-rich-text :doc="blok.message" />
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
