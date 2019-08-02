<template>
  <card>
    <h2 slot="header"><g-link :to="article.path">{{ article.title }}</g-link></h2>

    <div slot="body">
      <p v-if="article.hasUpdates">Updated <time :datetime="article.lastUpdated">{{ article.lastUpdated }}</time></p>
      <p>Posted <time :datetime="article.date">{{ article.date }}</time></p>

      <rich-text :html="article.summary" />

      <tag-list :tags="article.tag" />
    </div>
  </card>
</template>

<script>
import Card from '~/components/Card.vue';
import RichText from '~/components/RichText.vue';
import TagList from '~/components/TagList.vue';

export default {
  components: {
    Card,
    RichText,
    TagList
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>
