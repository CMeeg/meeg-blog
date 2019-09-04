<template>
  <div class="mb-2">
    <ul v-if="tags.length" class="flex flex-wrap justify-center">
      <li v-for="tag in tags" :key="tag.id" class="mr-2">
        <g-link :to="tag.path" class="font-mono inline-block text-red-400 bg-yellow-200 px-1 text-xs">{{ tag.name }}</g-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true
    }
  }
}
</script>
