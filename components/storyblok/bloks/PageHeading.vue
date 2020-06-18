<template>
  <div v-editable="blok" class="mx-auto px-6 py-8 max-w-2xl text-center">
    <h1 class="font-serif text-4xl sm:text-5xl">{{ blok.title }}</h1>

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
