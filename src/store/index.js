export const state = () => ({
  cacheVersion: '',
  global: {}
})

export const mutations = {
  setCacheVersion(state, version) {
    state.cacheVersion = version
  },
  setGlobal(state, global) {
    state.global = global.content
  }
}

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('loadCacheVersion')
    await dispatch('loadGlobal')
  },
  async loadCacheVersion({ commit }) {
    const space = await this.$storyblok().getSpace()

    commit('setCacheVersion', space.space.version)
  },
  async loadGlobal({ commit }) {
    const global = await this.$storyblok().get('global')

    commit('setGlobal', global.story)
  }
}
