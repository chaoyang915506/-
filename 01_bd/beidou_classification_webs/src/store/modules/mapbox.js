
const state = {
  timer:null,
  isShowSelectTimer:false
}

const mutations = {
    SET_CARRIERTIMER: (state,value ) => {
      state.timer = value
  },
  SET_ISSHOWSELECTTIMER: (state,value ) => {
    state.isShowSelectTimer = value
}
}

const actions = {
  changeSetting({ commit }, data) {
    commit('SET_CARRIERTIMER', data)
  },
  changeSetting({ commit }, data) {
    commit('SET_ISSHOWSELECTTIMER', data)
  },
}
export default {
  state,
  mutations,
  actions
}

