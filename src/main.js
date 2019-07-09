// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue';
import VRuntimeTemplate from "v-runtime-template";
import CodeSnippet from "~/components/CodeSnippet.vue";

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout);
  
  // Register rich text components globally because they do not work with local registration inside the Layout
  Vue.component('VRuntimeTemplate', VRuntimeTemplate);
  Vue.component('CodeSnippet', CodeSnippet);
}
