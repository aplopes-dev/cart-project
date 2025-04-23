import api from './api'

export const brandService = {
  /**
   * Busca todas as marcas
   * @param {boolean} activeOnly - Se true, retorna apenas marcas ativas
   * @returns {Promise<Array>} Lista de marcas
   */
  async getAllBrands() {
    const response = await api.get('/brands')
    return response.data
  },

  /**
   * Busca todas as marcas do sistema
   * @param {boolean} activeOnly - Se true, retorna apenas marcas ativas
   * @returns {Promise<Array>} Lista de marcas
   */
  async getBrands(activeOnly = false) {
    try {
      const response = await api.get('/settings/brands', {
        params: { active: activeOnly }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching brands:', error)
      throw error
    }
  }
}