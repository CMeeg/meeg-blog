<template>
  <main role="main">
    <page-heading>
      <template v-slot:title>
        {{ story.content.title }}
      </template>

      <template v-slot:metadata>
        <p
          class="content-block inline-flex items-center justify-center px-6 py-4 border-b border-gray-700 text-gray-500 text-xs"
        >
          <time :datetime="articleDate" class="uppercase">
            {{ articleDate }}
          </time>
          <template v-if="story.tag_list.length">
            <span class="pl-2">&#8226;</span>
            <span v-for="tag in story.tag_list" :key="tag" class="pl-2">
              <nuxt-link :to="{ name: 'tags-tag', params: { tag: tag } }">
                #{{ tag }}
              </nuxt-link>
            </span>
          </template>
          <template v-if="story.content.series">
            <span class="inline-block pl-2">&#8226;</span>
            <span class="inline-block pl-2">
              This article is part of a <a href="#series">series</a>
            </span>
          </template>
        </p>
      </template>
    </page-heading>

    <max-width-container>
      <field-rich-text :doc="story.content.body" />

      <article-series v-if="story.content.series" :story="story" class="pt-6" />
    </max-width-container>
  </main>
</template>

<script>
export default {
  asyncData(context) {
    return context.app.$storyblok().get(context.route.path, {
      resolve_relations: 'series'
    })
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
  },
  head() {
    const metadata = {
      ...this.story.content.metadata,
      article: {
        published_time: this.$storyblok().getStoryDate(this.story),
        author: '/about',
        section: 'Software Development',
        tags: this.story.tag_list
      }
    }

    if (!metadata.title) {
      metadata.title = this.story.content.title
    }

    return this.$metadata().getMetadata(metadata)
  }
}
</script>
