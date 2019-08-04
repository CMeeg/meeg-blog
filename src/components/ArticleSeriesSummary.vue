<template>
  <card>
    <h2 slot="header"><g-link :to="series.path">{{ series.title }}</g-link></h2>

    <div slot="body">
      <p>Updated <time :datetime="series.lastUpdated">{{ series.lastUpdated }}</time></p>

      <rich-text :html="series.summary" />

      <p>Articles in this series:</p>

      <ol>
        <li v-for="article in series.articlesInSeries" :key="article.id">
          <g-link :to="article.path">{{ article.title }}</g-link>
        </li>
      </ol>
    </div>
  </card>
</template>

<script>
import Card from '~/components/Card.vue';
import RichText from '~/components/RichText.vue';

export default {
  components: {
    Card,
    RichText
  },
  props: {
    series: {
      type: Object,
      required: true
    }
  }
}
</script>
