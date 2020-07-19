import Vue from 'vue'
import Blok from '~/components/storyblok/Blok'
import Page from '~/components/storyblok/bloks/Page'
import ArticleListing from '~/components/storyblok/bloks/ArticleListing'
import MessageBox from '~/components/storyblok/bloks/MessageBox'
import PageHeading from '~/components/storyblok/bloks/PageHeading'
import Blocks from '~/components/storyblok/fields/Blocks'
import ImageAsset from '~/components/storyblok/fields/ImageAsset'
import RichText from '~/components/storyblok/fields/RichText'
import VueRichTextRenderer from '@marvr/storyblok-rich-text-vue-renderer'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Block, Mark } from '@marvr/storyblok-rich-text-types'
import RichTextDocument from '~/components/storyblok/fields/rich-text/blocks/Document'
import RichTextCodeBlock from '~/components/storyblok/fields/rich-text/blocks/Code'
import RichTextCodeMark from '~/components/storyblok/fields/rich-text/marks/Code'
import RichTextLink from '~/components/storyblok/fields/rich-text/marks/Link'
import RichTextBlok from '~/components/storyblok/fields/rich-text/components/Blok'

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
      [Mark.CODE]: RichTextCodeMark,
      [Mark.LINK]: RichTextLink
    },
    components: {
      // eslint-disable-next-line camelcase
      message_box: RichTextBlok
    }
  }
})
