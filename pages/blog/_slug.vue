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
          <span class="inline-block ml-2">&#8226;</span>
          <ul v-if="story.tag_list" class="flex items-center">
            <li v-for="tag in story.tag_list" :key="tag" class="ml-2">
              {{ tag }}
            </li>
          </ul>
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
    const path = context.route.path

    const storyblok = context.app.$storyblok()

    return storyblok.get(path.substr(1))
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
