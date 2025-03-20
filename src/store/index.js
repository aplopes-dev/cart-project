import { createStore } from 'vuex'
import { authService } from '@/services/auth.service'

export default createStore({
  state: {
    currentUser: null,
    isAuthenticated: false
  },
  mutations: {
    SET_USER(state, user) {
      state.currentUser = user
      state.isAuthenticated = !!user
    }
  },
  actions: {
    updateUser({ commit }) {
      const user = authService.getCurrentUser()
      commit('SET_USER', user)
    },
    async login({ commit }, { email, password }) {
      const response = await authService.login(email, password)
      const user = authService.getCurrentUser()
      commit('SET_USER', user)
      return response
    },
    logout({ commit }) {
      authService.logout()
      commit('SET_USER', null)
    }
  }
})