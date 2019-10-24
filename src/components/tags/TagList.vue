<template>
  <ul v-if="tagItems.length" class="flex flex-wrap justify-center">
    <li v-for="tag in tagItems" :key="tag.id" class="font-mono inline-block bg-yellow-200 px-1 mr-2">
      <g-link :to="tag.path" class="text-red-400">
        <svg class="stroke-current text-red-400 h-3 w-3 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>{{ tag.name }}<span v-if="tag.belongsTo"> ({{ tag.belongsTo.totalCount }})</span>
      </g-link>
    </li>
  </ul>
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
