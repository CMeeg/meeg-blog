<template>
  <card>
    <div slot="header" class="text-center">
      <h2 class="font-cursive text-lg md:text-2xl"><g-link :to="article.path">{{ article.title }}</g-link></h2>
      <p class="text-gray-600 text-xs my-2"><time :datetime="article.date" class="inline-block pb-2 px-6 border-b-2">{{ new Date(article.date).toDateString() }}</time></p>
    </div>

    <div slot="body">
      <div v-if="article.tag" class="mb-2 text-xs">
        <tag-list :tags="article.tag" />
      </div>

      <div class="text-sm md:text-base">
        <rich-text :html="article.summary" />
      </div>

      <p class="text-right"><g-link :to="article.path" class="inline-block text-white text-sm rounded-lg bg-red-600 hover:bg-red-500 hover:no-underline focus:no-underline p-2">Read this post</g-link></p>
    </div>
  </card>
</template>

<script>
import Card from '@/components/Card.vue';
import RichText from '@/components/kontent/RichText.vue';
import TagList from '@/components/tags/TagList.vue';

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
