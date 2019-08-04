<template>
  <node-list :nodes="articles" :pager-options="{ prevLabel: 'See newer articles', nextLabel: 'See older articles' }">
    <article-summary slot="node" slot-scope="{ node }" :article="node" />
  </node-list>
</template>

<script>
import NodeList from '~/components/NodeList.vue';
import ArticleSummary from '~/components/ArticleSummary.vue';

export default {
  components: {
    NodeList,
    ArticleSummary
  },
  props: {
    articles: {
      type: Object,
      required: true
    }
  }
}
</script>
