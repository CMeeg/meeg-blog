export const state = () => ({
  cacheVersion: null
})

export const mutations = {
  setCacheVersion(state, version) {
    state.cacheVersion = version
  }
}

export const actions = {
  async init({ state, dispatch }) {
    if (state.cacheVersion) {
      return
    }

    await dispatch('loadCacheVersion')
  },
  async loadCacheVersion({ commit }) {
    const space = await this.$storyblok().getSpace()

    commit('setCacheVersion', space.space.version)
  }
}
