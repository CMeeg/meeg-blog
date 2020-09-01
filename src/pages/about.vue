<template>
  <main role="main">
    <page-heading>
      <template v-slot:title>
        {{ story.content.title }}
      </template>

      <template v-if="story.content.intro" v-slot:intro>
        <field-rich-text :doc="story.content.intro" />
      </template>
    </page-heading>

    <max-width-container>
      <field-rich-text :doc="story.content.bio" />
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
  mounted() {
    this.$storyblok().reloadOnChange(this.story)
  },
  head() {
    const metadata = {
      ...this.story.content.metadata,
      profile: {
        first_name: 'Chris',
        last_name: 'Meagher'
      }
    }

    return this.$metadata().getMetadata(metadata)
  }
}
</script>
