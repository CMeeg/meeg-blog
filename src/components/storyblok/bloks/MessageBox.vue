<template>
  <message-box :type="blok.type">
    <field-rich-text :doc="blok.message" class="prose-sm" />
  </message-box>
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
