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
    dispatch('loadCacheVersion')
    await dispatch('loadGlobal')
  },
  loadCacheVersion({ commit }) {
    return this.$storyapi.get(`cdn/spaces/me`).then(res => {
      commit('setCacheVersion', res.data.space.version)
    })
  },
  async loadGlobal({ commit }) {
    const global = await this.$storyblok().get('global')

    commit('setGlobal', global.story)
  }
}
