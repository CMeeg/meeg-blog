export const state = () => ({
  cacheVersion: '',
  global: {
    main_nav: []
  }
})

export const mutations = {
  setCacheVersion(state, version) {
    state.cacheVersion = version
  },
  setGlobal(state, global) {
    state.global = global
  }
}

export const actions = {
  loadCacheVersion({ commit }) {
    return this.$storyapi.get(`cdn/spaces/me`).then(res => {
      commit('setCacheVersion', res.data.space.version)
    })
  },
  loadGlobal({ commit }, context) {
    return this.$storyapi
      .get(`cdn/stories/global`, {
        version: context.version
      })
      .then(res => {
        commit('setGlobal', res.data.story.content)
      })
  }
}
