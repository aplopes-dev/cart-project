import api from './api'

const API_URL = process.env.VUE_APP_API_URL

export const userService = {
  async getUsers(filters = {}) {
    try {
      const { search, profile, page = 1, limit = 10 } = filters
      const response = await api.get(`${API_URL}/users`, {
        params: {
          search,
          profile,
          page,
          limit
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  async updateUserProfile(userId, profile) {
    try {
      const response = await api.patch(`${API_URL}/users/${userId}/profile`, {
        profile
      })
      return response.data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }
}
