<template>
  <main role="main">
    <page-heading>
      <template v-slot:title>Tags</template>
      <template v-slot:intro>
        <div class="content-block">
          <p>
            My blog contains articles related to the following topics...
          </p>
        </div>
      </template>
    </page-heading>

    <div class="content-block mx-auto px-6 max-w-2xl text-center">
      <ul v-if="tags">
        <li v-for="tag in tags" :key="tag.name" class="list-none">
          <p>
            <nuxt-link :to="{ name: 'tags-tag', params: { tag: tag.name } }">
              {{ tag.name }}
            </nuxt-link>
            ({{
              tag.taggings_count === 1
                ? `${tag.taggings_count} article`
                : `${tag.taggings_count} articles`
            }})
          </p>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  asyncData(context) {
    return context.app.$storyblok().getTags()
  },
  data() {
    return {
      tags: []
    }
  },
  head() {
    return this.$metadata().getMetadata({
      title: 'Tags',
      description:
        'A list of the topics that articles have been written about on my blog.'
    })
  }
}
</script>
