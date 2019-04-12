const state = {
  userName: null
};

const getters = {
  isLoggedIn: state => !!state.userName,
  userName: state => state.userName
};

const actions = {
  logout: ({ commit }) => {
    commit('setUserName', null);
  },
  login: ({ commit }, userName) => {
    commit('setUserName', userName);
  }
};

const mutations = {
  setUserName: (state, userName) => {
    state.userName = userName;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
