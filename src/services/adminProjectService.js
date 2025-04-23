import api from './api'

/**
 * Serviço para gerenciar projetos no modo administrador
 */
export const adminProjectService = {
  /**
   * Busca todos os projetos do sistema (apenas para administradores)
   * @returns {Promise<Array>} Lista de todos os projetos
   */
  async getAllProjects() {
    try {
      const response = await api.get('/projects/admin/all')
      return response.data || []
    } catch (error) {
      console.error('Error fetching all projects:', error)
      throw error
    }
  }
}

export default adminProjectService
