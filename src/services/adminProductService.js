import api from './api'

/**
 * Serviço para gerenciar produtos no modo administrador
 */
export const adminProductService = {
  /**
   * Busca todos os produtos do sistema (apenas para administradores)
   * @returns {Promise<Array>} Lista de todos os produtos
   */
  async getAllProducts() {
    try {
      const response = await api.get('/products/admin/all')
      return response.data
    } catch (error) {
      console.error('Error fetching all products:', error)
      throw error
    }
  }
}

export default adminProductService
