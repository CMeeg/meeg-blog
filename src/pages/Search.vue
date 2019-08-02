<template>
  <layout>
    <h1>{{ pageNode.title }}</h1>

    <h2>Find articles by tag</h2>

    <card>
      <div slot="body">
        <tag-list :tags="$static.tags.edges" :display-as-cloud="true" />
      </div>
    </card>
  </layout>
</template>

<static-query>
query Tags {
  tags: allTaxonomyTag {
    edges {
      node {
        name,
        id,
        path,
        belongsTo {
          totalCount
        }
      }
    }
  }
}
</static-query>

<script>
import Card from '~/components/Card.vue';
import TagList from '~/components/TagList.vue';
import metadata from '~/mixins/Metadata';

export default {
  components: {
    Card,
    TagList
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return {
        title: 'Search',
        url: '/search'
      }
    }
  }
}
</script>
