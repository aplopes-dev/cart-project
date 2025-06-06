import api from './api'

/**
 * Serviço para gerenciar pedidos no modo administrador
 */
export const adminOrderService = {
  /**
   * Busca todos os pedidos com filtros (apenas para administradores)
   * @param {Object} filters - Filtros para busca de pedidos
   * @param {string} filters.startDate - Data inicial (formato YYYY-MM-DD)
   * @param {string} filters.endDate - Data final (formato YYYY-MM-DD)
   * @param {Array} filters.products - IDs dos produtos para filtrar
   * @param {Array} filters.cities - Cidades para filtrar
   * @param {Array} filters.projects - IDs dos projetos para filtrar
   * @param {number} filters.page - Número da página
   * @param {number} filters.limit - Quantidade de itens por página
   * @param {string} filters.sort - Ordenação (date_asc, date_desc, total_asc, total_desc)
   * @returns {Promise<Object>} Objeto com pedidos paginados
   */
  async getOrders(filters = {}) {
    try {
      const {
        startDate,
        endDate,
        products,
        cities,
        projects,
        page = 1,
        limit = 10,
        sort = 'date_desc'
      } = filters

      // Preparar parâmetros para a requisição
      const params = {
        page,
        limit,
        sort
      }

      // Adicionar filtros se estiverem preenchidos
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      if (products && products.length > 0) {
        params.products = products.map(p => p.id).join(',')
      }
      if (cities && cities.length > 0) {
        params.cities = cities.map(c => c.id).join(',')
      }
      if (projects && projects.length > 0) {
        params.projects = projects.map(p => p.id).join(',')
      }

      const response = await api.get('/orders/admin/list', { params })
      return response.data || { items: [], total: 0, totalPages: 0 }
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  },

  /**
   * Busca detalhes de um pedido específico (apenas para administradores)
   * @param {string} orderId - ID do pedido
   * @returns {Promise<Object>} Detalhes do pedido
   */
  async getOrderDetails(orderId) {
    try {
      const response = await api.get(`/orders/admin/details/${orderId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching order details for ID ${orderId}:`, error)
      throw error
    }
  },

  /**
   * Exporta pedidos para Excel com filtros (apenas para administradores)
   * @param {Object} filters - Filtros para exportação de pedidos
   * @param {string} filters.startDate - Data inicial (formato YYYY-MM-DD)
   * @param {string} filters.endDate - Data final (formato YYYY-MM-DD)
   * @param {Array} filters.products - IDs dos produtos para filtrar
   * @param {Array} filters.cities - Cidades para filtrar
   * @param {Array} filters.projects - IDs dos projetos para filtrar
   * @param {string} filters.sort - Ordenação (date_asc, date_desc, total_asc, total_desc)
   * @returns {Promise<Array>} Array com dados para exportação
   */
  async exportOrders(filters = {}) {
    try {
      const {
        startDate,
        endDate,
        products,
        cities,
        projects,
        sort = 'date_desc'
      } = filters

      // Preparar parâmetros para a requisição
      const params = {
        export: true,
        sort
      }

      // Adicionar filtros se estiverem preenchidos
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      if (products && products.length > 0) {
        params.products = products.map(p => p.id).join(',')
      }
      if (cities && cities.length > 0) {
        params.cities = cities.map(c => c.id).join(',')
      }
      if (projects && projects.length > 0) {
        params.projects = projects.map(p => p.id).join(',')
      }

      const response = await api.get('/orders/admin/export', { params })
      return response.data || []
    } catch (error) {
      console.error('Error exporting orders:', error)
      throw error
    }
  },

  /**
   * Atualiza o status de um pedido (apenas para administradores)
   * @param {string} orderId - ID do pedido
   * @param {string} status - Novo status (pending, processing, completed, cancelled)
   * @returns {Promise<Object>} Resposta da atualização
   */
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/orders/admin/${orderId}/status`, {
        status
      })
      return response.data
    } catch (error) {
      console.error(`Error updating order status for ID ${orderId}:`, error)
      throw error
    }
  }
}

export default adminOrderService
