export default function ({ route, store, isDev }) {
  let version = route.query._storyblok || isDev ? 'draft' : 'published'

  if (!store.state.global._uid) {
    return store.dispatch('loadGlobal', {version: version})
  }
}
