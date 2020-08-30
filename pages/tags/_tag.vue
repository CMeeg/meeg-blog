<template>
  <main role="main">
    <page-heading>
      <template v-slot:title>{{ tag }}</template>
      <template v-slot:intro>
        <div class="prose">
          <p>
            Articles about <i>{{ tag }}</i> can be found below.<br />
            <nuxt-link :to="{ name: 'tags' }">See all tags</nuxt-link>
          </p>
        </div>
      </template>
    </page-heading>

    <max-width-container>
      <article-list :with-tag="tag" />
    </max-width-container>
  </main>
</template>

<script>
export default {
  data() {
    return {
      tag: this.$route.params.tag
    }
  },
  head() {
    return this.$metadata().getMetadata({
      title: `Articles about ${this.tag}`,
      description: `A list of the articles that have been written about ${this.tag} on my blog.`
    })
  }
}
</script>
