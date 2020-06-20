import Vue from 'vue'
import { Block } from '@marvr/storyblok-rich-text-types'
import Page from '~/components/storyblok/bloks/Page.vue'
import Blok from '~/components/storyblok/Blok.vue'
import PageHeading from '~/components/storyblok/bloks/PageHeading.vue'
import MessageBox from '~/components/storyblok/bloks/MessageBox.vue'
import Blocks from '~/components/storyblok/fields/Blocks.vue'
import RichText from '~/components/storyblok/fields/RichText.vue'
import ImageAsset from '~/components/storyblok/fields/ImageAsset.vue'
import VueRichTextRenderer from '@marvr/storyblok-rich-text-vue-renderer'
import RichTextDocument from '~/components/storyblok/fields/rich-text/blocks/Document.vue'
import RichTextBlok from '~/components/storyblok/fields/rich-text/components/Blok.vue'

Vue.component('blok', Blok)

// Stories
Vue.component('blok-page', Page)

// Blocks
Vue.component('blok-page-heading', PageHeading)
Vue.component('blok-message-box', MessageBox)

// Fields
Vue.component('field-blocks', Blocks)
Vue.component('field-rich-text', RichText)
Vue.component('field-image-asset', ImageAsset)

// Storyblok Rich text renderer
// See https://storyblok-rich-text-renderer.netlify.app/ for usage
Vue.use(VueRichTextRenderer, {
  resolvers: {
    blocks: {
      [Block.DOCUMENT]: RichTextDocument
    },
    components: {
      message_box: RichTextBlok
    }
  }
})
