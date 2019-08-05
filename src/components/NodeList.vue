<template>
  <div>
    <ul v-if="nodeItems.length">
      <li v-for="node in nodeItems" :key="node.id">
        <slot name="node" :node="node" />
      </li>
    </ul>

    <pager
      v-if="pageInfo"
      :info="pageInfo"
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
import { system } from '~/utils';

export default {
  components: {
    Pager
  },
  props: {
    nodes: {
      type: [ Object, Array ],
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
  },
  computed: {
    nodeItems: function() {
      let nodes = this.nodes;

      if (system.isObject(nodes)) {
        if (nodes.hasOwnProperty('edges')) {
          nodes = this.nodes.edges;
        }
      }

      return nodes.map(node => {
        if (node.hasOwnProperty('node')) {
          return node.node;
        }

        return node;
      });
    },
    pageInfo: function() {
      if (Array.isArray(this.nodes)) {
        return null;
      }

      if (this.nodes.hasOwnProperty('pageInfo')) {
        return this.nodes.pageInfo;
      }

      return null;
    }
  }
}
</script>
