import api from './api'

/**
 * Serviço para gerenciar endereços no modo administrador
 */
export const adminAddressService = {
  /**
   * Busca todas as cidades com endereços de entrega cadastrados (apenas para administradores)
   * @returns {Promise<Array>} Lista de todas as cidades
   */
  async getAllShippingCities() {
    try {
      const response = await api.get('/addresses/admin/shipping-cities')
      return response.data || []
    } catch (error) {
      console.error('Error fetching all shipping cities:', error)
      throw error
    }
  }
}

export default adminAddressService
