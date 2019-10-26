<template>
  <div>
    <page-intro :title="pageNode.title" />

    <div class="rich-text">
      <p>
        Thank you to the creators and contributors of these projects for releasing
        your awesome work and making it free or open source so that people like me
        can use it in our own projects like this blog:
      </p>

      <ul>
        <li><g-link to="https://gridsome.org/">Gridsome</g-link></li>
        <li><g-link to="https://kontent.ai/">Kentico Kontent</g-link></li>
        <li><g-link to="https://feathericons.com/">Feather icons</g-link></li>
        <li><g-link to="https://tailwindcss.com/">Tailwind</g-link></li>
        <li>
          <g-link to="https://github.com/googlefonts/Pacifico">Pacifico font</g-link>
          via <g-link to="https://fonts.google.com/specimen/Pacifico">Google fonts</g-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PageIntro from '@/components/PageIntro.vue';
import metadata from '@/mixins/Metadata';

export default {
  components: {
    PageIntro
  },
  mixins: [
    metadata
  ],
  computed: {
    pageNode: function() {
      return {
        title: 'Thanks!',
        url: '/thanks/'
      }
    }
  }
}
</script>
