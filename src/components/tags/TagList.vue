<template>
  <div class="mb-2">
    <ul v-if="tagItems.length" class="flex flex-wrap justify-center">
      <li v-for="tag in tagItems" :key="tag.id" class="mr-2">
        <g-link :to="tag.path" class="font-mono inline-block text-red-400 bg-yellow-200 px-1 text-xs">{{ tag.name }}</g-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { system } from '@/utils';

export default {
  props: {
    tags: {
      type: [Object, Array],
      required: true
    }
  },
  computed: {
    tagItems: function() {
      let tags = this.tags;

      if (system.isObject(tags)) {
        if (Object.prototype.hasOwnProperty.call(tags, 'edges')) {
          tags = this.tags.edges;
        }
      }

      return tags.map(tag => {
        if (Object.prototype.hasOwnProperty.call(tag, 'node')) {
          return tag.node;
        }

        return tag;
      });
    }
  }
}
</script>
