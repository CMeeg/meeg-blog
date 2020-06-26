import Vue from 'vue'
import Blok from '~/components/storyblok/Blok.vue'
import Page from '~/components/storyblok/bloks/Page.vue'
import ArticleListing from '~/components/storyblok/bloks/ArticleListing.vue'
import MessageBox from '~/components/storyblok/bloks/MessageBox.vue'
import PageHeading from '~/components/storyblok/bloks/PageHeading.vue'
import Blocks from '~/components/storyblok/fields/Blocks.vue'
import ImageAsset from '~/components/storyblok/fields/ImageAsset.vue'
import RichText from '~/components/storyblok/fields/RichText.vue'
import VueRichTextRenderer from '@marvr/storyblok-rich-text-vue-renderer'
import { Block, Mark } from '@marvr/storyblok-rich-text-types'
import RichTextDocument from '~/components/storyblok/fields/rich-text/blocks/Document.vue'
import RichTextCodeBlock from '~/components/storyblok/fields/rich-text/blocks/Code.vue'
import RichTextCodeMark from '~/components/storyblok/fields/rich-text/marks/Code.vue'
import RichTextBlok from '~/components/storyblok/fields/rich-text/components/Blok.vue'

Vue.component('blok', Blok)

// Stories
Vue.component('blok-page', Page)

// Blocks
Vue.component('blok-article-listing', ArticleListing)
Vue.component('blok-message-box', MessageBox)
Vue.component('blok-page-heading', PageHeading)

// Fields
Vue.component('field-blocks', Blocks)
Vue.component('field-image-asset', ImageAsset)
Vue.component('field-rich-text', RichText)

// Storyblok Rich text renderer
// See https://storyblok-rich-text-renderer.netlify.app/ for usage
Vue.use(VueRichTextRenderer, {
  resolvers: {
    blocks: {
      [Block.DOCUMENT]: RichTextDocument,
      [Block.CODE]: RichTextCodeBlock
    },
    marks: {
      [Mark.CODE]: RichTextCodeMark
    },
    components: {
      message_box: RichTextBlok
    }
  }
})
