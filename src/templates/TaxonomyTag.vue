<template>
  <layout>
    <h1>{{ pageNode.name }}</h1>

    <p>{{ pageSummary }}</p>

    <node-list :nodes="pageNode.belongsTo" :pager-options="{ prevLabel: 'See newer articles', nextLabel: 'See older articles' }">
      <article-summary slot="node" slot-scope="{ node }" :article="node" />
    </node-list>
  </layout>
</template>

<page-query>
query TaxonomyTag($id: String!, $page: Int) {
  tag: taxonomyTag(id: $id) {
    name,
    belongsTo(sortBy: "sortDate", perPage: 10, page: $page) @paginate {
      totalCount,
      edges {
        node {
          ... on Article {
            title,
            summary,
            tag {
              id,
              name,
              path
            },
            path,
            date,
            lastUpdated
          }
        }
      }
    }
  }
}
</page-query>

<script>
import NodeList from '~/components/NodeList.vue';
import ArticleSummary from '~/components/ArticleSummary.vue';
import metadata from '~/mixins/Metadata';

export default {
  components: {
    NodeList,
    ArticleSummary
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      const node = this.$page.tag;

      node.title = `Articles about ${node.name}`;

      return node;
    },
    pageSummary: function() {
      const count = this.pageNode.belongsTo.totalCount;
      const name = this.pageNode.name;

      if (count === 0) {
        return `There are no articles about ${name}.`;
      }

      if (count === 1) {
        return `There is 1 article about ${name}.`;
      }

      return `There are ${count} articles about ${name}.`;
    }
  }
}
</script>
