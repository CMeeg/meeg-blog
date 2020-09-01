<template>
  <card>
    <template v-slot:header>
      <p class="mb-2 text-gray-500 text-xs uppercase">
        <time :datetime="articleDate">
          {{ articleDate }}
        </time>
      </p>
      <h2 class="mb-2 font-serif leading-6 text-xl">
        <nuxt-link
          :to="article.full_slug | rootRelative"
          class="text-green-400 focus:underline focus:outline-none hover:underline"
        >
          {{ article.content.title }}
        </nuxt-link>
      </h2>
    </template>
    <template v-slot:body>
      <field-rich-text :doc="article.content.summary" class="prose-sm" />
    </template>
  </card>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    articleDate() {
      return this.$storyblok().getStoryDate(this.article).toDateString()
    }
  }
}
</script>
