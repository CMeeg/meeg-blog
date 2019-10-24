<template>
  <card>
    <div slot="header" class="text-center">
      <h2 class="font-cursive text-lg md:text-2xl"><g-link :to="series.path">{{ series.title }}</g-link></h2>
      <p class="text-gray-600 text-xs my-2"><time :datetime="series.lastUpdated" class="inline-block pb-2 px-6 border-b-2">{{ new Date(series.lastUpdated).toDateString() }}</time></p>
    </div>

    <div slot="body">
      <div class="text-sm md:text-base">
        <rich-text :html="series.summary" />

        <h3 class="font-cursive text-base md:text-lg mt-4 mb-2">Articles in this series</h3>

        <ol class="list-decimal list-outside ml-4">
          <li v-for="article in series.articlesInSeries" :key="article.id" class="mb-1">
            <g-link :to="article.path">{{ article.title }}</g-link>
          </li>
        </ol>
      </div>
    </div>
  </card>
</template>

<script>
import Card from '@/components/Card.vue';
import RichText from '@/components/kontent/RichText.vue';

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
