export const state = () => ({
  global: null
})

export const mutations = {
  setGlobal(state, global) {
    state.global = global.content
  }
}

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('storyblok/init')
    await dispatch('init')
  },
  async init({ state, dispatch }) {
    if (state.global) {
      return
    }

    await dispatch('loadGlobal')
  },
  async loadGlobal({ commit }) {
    const global = await this.$storyblok().get('global')

    commit('setGlobal', global.story)
  }
}
