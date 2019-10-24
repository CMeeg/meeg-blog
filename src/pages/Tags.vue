<template>
  <div>
    <page-intro :title="pageNode.title">
      <p slot="body" class="font-serif italic md:text-lg leading-tight">All tags used by published articles are listed below</p>
    </page-intro>

    <card>
      <div slot="body">
        <tag-list :tags="$static.tags.edges" />
      </div>
    </card>
  </div>
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
import PageIntro from '@/components/PageIntro.vue';
import Card from '@/components/Card.vue';
import TagList from '@/components/tags/TagList.vue';
import metadata from '@/mixins/Metadata';

export default {
  components: {
    PageIntro,
    Card,
    TagList
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return {
        title: 'Tags',
        url: '/tags/'
      }
    }
  }
}
</script>
