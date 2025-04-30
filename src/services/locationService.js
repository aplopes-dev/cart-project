import api from './api'

const API_URL = process.env.VUE_APP_API_URL

export const locationService = {
  /**
   * Busca todos os locais disponíveis
   * @returns {Promise<Array>} Lista de locais
   */
  async getLocations() {
    try {
      const response = await api.get(`${API_URL}/locations`)
      return response.data
    } catch (error) {
      console.error('Error fetching locations:', error)
      throw error
    }
  },

  /**
   * Busca um local pelo ID
   * @param {string} id - ID do local
   * @returns {Promise<Object>} Dados do local
   */
  async getLocationById(id) {
    try {
      const response = await api.get(`${API_URL}/locations/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching location with ID ${id}:`, error)
      throw error
    }
  }
}
