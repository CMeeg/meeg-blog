<template>
  <main role="main">
    <page-heading>
      <template v-slot:title>
        {{ story.content.title }}
      </template>

      <template v-slot:metadata>
        <div
          class="inline-flex items-center justify-center px-6 py-4 border-b border-gray-700 text-gray-500 text-xs uppercase"
        >
          <time :datetime="articleDate">
            {{ articleDate }}
          </time>
          <template v-if="story.tag_list.length">
            <span class="inline-block ml-2 mr-1">&#8226;</span>
            <span
              v-for="(tag, index) in story.tag_list"
              :key="tag"
              class="inline-block ml-1"
            >
              <nuxt-link
                :to="{ name: 'tags-tag', params: { tag: tag } }"
                class="text-green-400 focus:underline focus:outline-none hover:underline"
              >
                {{ tag }}
              </nuxt-link>
              <template v-if="index !== story.tag_list.length - 1">, </template>
            </span>
          </template>
        </div>
      </template>
    </page-heading>

    <max-width-container>
      <field-rich-text :doc="story.content.body" />
    </max-width-container>
  </main>
</template>

<script>
export default {
  asyncData(context) {
    return context.app.$storyblok().get(context.route.path)
  },
  data() {
    return {
      story: {
        content: {}
      }
    }
  },
  computed: {
    articleDate() {
      return this.$storyblok()
        .getStoryDate(this.story)
        .toDateString()
    }
  },
  mounted() {
    this.$storyblok().reloadOnChange(this.story)
  }
}
</script>
