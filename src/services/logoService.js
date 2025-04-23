import api from './api'

export const logoService = {
  /**
   * Busca a logo ativa do sistema
   * @returns {Promise<Object>} A logo ativa
   */
  async getActiveLogo() {
    try {
      const response = await api.get('/settings/logos/active')
      return response.data
    } catch (error) {
      console.error('Error fetching active logo:', error)
      throw error
    }
  }
}

export default logoService
