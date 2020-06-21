<template>
  <main role="main">
    <page-heading>
      <template v-slot:title>Tags</template>
      <template v-slot:intro>
        <div class="content-block">
          <p>
            Use these tags to find all the articles I have written related to
            that particular topic...
          </p>
        </div>
      </template>
    </page-heading>

    <max-width-container>
      <div class="content-block">
        <ul v-if="tags">
          <li v-for="tag in tags" :key="tag.name">
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
    </max-width-container>
  </main>
</template>

<script>
export default {
  asyncData(context) {
    const storyblok = context.app.$storyblok()

    return storyblok.getTags()
  },
  data() {
    return {
      tags: []
    }
  }
}
</script>
