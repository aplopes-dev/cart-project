import { createStore } from 'vuex'
import { authService } from '@/services/auth.service'

export default createStore({
  state: {
    isAuthenticated: false,
    currentUser: null
  },
  mutations: {
    SET_AUTH(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    },
    SET_USER(state, user) {
      state.currentUser = user
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await authService.login(email, password)
        // Garantir que temos todos os dados do usuário
        const userData = response.user || {
          email,
          firstName: response.user?.firstName,
          lastName: response.user?.lastName,
          id: response.user?.id
        }
        
        commit('SET_AUTH', true)
        commit('SET_USER', userData)
        return response
      } catch (error) {
        commit('SET_AUTH', false)
        commit('SET_USER', null)
        throw error
      }
    },
    
    async signup({ commit }, userData) {
      try {
        const response = await authService.signup(userData)
        const userDataToStore = response.user || {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          id: response.user?.id
        }
        
        commit('SET_AUTH', true)
        commit('SET_USER', userDataToStore)
        return response
      } catch (error) {
        commit('SET_AUTH', false)
        commit('SET_USER', null)
        throw error
      }
    },
    
    logout({ commit }) {
      authService.logout()
      commit('SET_AUTH', false)
      commit('SET_USER', null)
    },
    
    updateUser({ commit }) {
      const user = authService.getCurrentUser()
      const isAuthenticated = authService.isAuthenticated()
      
      if (isAuthenticated && user) {
        commit('SET_AUTH', true)
        commit('SET_USER', user)
      } else {
        commit('SET_AUTH', false)
        commit('SET_USER', null)
      }
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.currentUser
  }
})





