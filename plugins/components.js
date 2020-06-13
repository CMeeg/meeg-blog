import Vue from 'vue'
import Page from '~/components/storyblok/bloks/Page.vue'
import Teaser from '~/components/storyblok/bloks/Teaser.vue'
import Grid from '~/components/storyblok/bloks/Grid.vue'
import Feature from '~/components/storyblok/bloks/Feature.vue'
import ImageAsset from '~/components/storyblok/fields/ImageAsset.vue'

Vue.component('blok-page', Page)
Vue.component('blok-teaser', Teaser)
Vue.component('blok-grid', Grid)
Vue.component('blok-feature', Feature)
Vue.component('field-image-asset', ImageAsset)
