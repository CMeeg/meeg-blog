<template>
  <div>
    <ul>
      <li v-for="edge in nodes.edges" :key="edge.node.id">
        <slot name="node" :node="edge.node" />
      </li>
    </ul>

    <pager
      v-if="hasPageInfo"
      :info="nodes.pageInfo"
      :show-links="false"
      :show-navigation="true"
      :range="1"
      :first-label="null"
      :prev-label="pagerOptions.prevLabel"
      :next-label="pagerOptions.nextLabel"
      :last-label="null"
    />
  </div>
</template>

<script>
import { Pager } from 'gridsome';

export default {
  components: {
    Pager
  },
  props: {
    nodes: {
      type: Object,
      required: true
    },
    pagerOptions: {
      type: Object,
      required: false,
      default: function() {
        return {
          prevLabel: 'See previous',
          nextLabel: 'See next'
        }
      }
    }
  },
  data: function() {
    return {
      hasPageInfo: typeof(this.nodes.pageInfo) !== 'undefined'
    }
  }
}
</script>
