<template>
  <div>
    <page-intro :title="pageNode.title" />

    <div class="rich-text">
      <p>Sorry that you've ended up here... you may want to try:</p>

      <ul>
        <li>Browsing through the <g-link to="/articles/">articles</g-link> list</li>
        <li>Browsing through the <g-link to="/series/">articles series</g-link> list</li>
        <li>Finding articles by <g-link to="/tags/">tag</g-link></li>
        <li>Searching for the article via your preferred search engine</li>
      </ul>
    </div>
  </div>
</template>

<script>
import PageIntro from '@/components/PageIntro.vue';
import metadata from '@/mixins/Metadata';

export default {
  components: {
    PageIntro
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return {
        title: 'Page not found',
        url: '/404/'
      }
    }
  }
}
</script>
