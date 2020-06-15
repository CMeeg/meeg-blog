<template>
  <div v-editable="blok" class="article-listing">
    <h1>{{ blok.title }}</h1>

    <div v-for="article in articles.stories" :key="article.content._uid">
      <h2>
        <nuxt-link :to="'/' + article.full_slug">
          {{ article.content.title }}
        </nuxt-link>
      </h2>
      <small>
        {{ article.published_at }}
      </small>
      <p>
        {{ article.content.summary }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  asyncData(context) {
    let path = context.route.path

    const storyblok = context.app.$storyblok()

    const story = storyblok.get(path)

    const articles = storyblok.getAll({
      starts_with: path.substr(1),
      is_startpage: 0
    })

    return Promise.all([story, articles]).then(results => {
      return {
        ...results[0],
        articles: {
          ...results[1]
        }
      }
    })
  },
  data() {
    return {
      story: { content: {} },
      articles: {
        total: 0,
        stories: []
      }
    }
  },
  computed: {
    blok: function() {
      return this.story.content
    }
  },
  mounted() {
    this.$storyblok().reloadOnChange(this.story)
  }
}
</script>
