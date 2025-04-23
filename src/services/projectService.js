import api from './api'
import eventBus from '@/utils/eventBus'

const API_URL = process.env.VUE_APP_API_URL
console.log('API_URL no projectService:', API_URL)

export const projectService = {
  /**
   * Busca projetos associados a um usuário pelo email
   * @param {string} email - Email do usuário
   * @returns {Promise<Array>} - Lista de projetos
   */
  async getProjectsByUserEmail(email) {
    console.log(`Iniciando chamada à API para buscar projetos do usuário: ${email}`)
    try {
      console.log(`URL da API: ${API_URL}/users/projects/by-email?email=${email}`)
      const response = await api.get(`${API_URL}/users/projects/by-email`, {
        params: { email }
      })
      console.log('Resposta da API de projetos:', response.data)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar projetos do usuário:', error)
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  },

  /**
   * Busca projetos do usuário logado (usando o token JWT)
   * @returns {Promise<Array>} - Lista de projetos do usuário logado
   */
  async getCurrentUserProjects() {
    console.log('Iniciando chamada à API para buscar projetos do usuário logado')
    try {
      const response = await api.get(`${API_URL}/users/projects/current`)
      console.log('Resposta da API de projetos do usuário logado:', response.data)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar projetos do usuário logado:', error)
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  },

  /**
   * Salva o projeto selecionado no sessionStorage
   * @param {Object} project - Objeto do projeto
   */
  saveSelectedProject(project) {
    sessionStorage.setItem('selectedProject', JSON.stringify(project))
    // Emite um evento global para notificar todos os componentes
    eventBus.emit('selected-project-changed', project)
    console.log('Evento selected-project-changed emitido com:', project)
  },

  /**
   * Obtém o projeto selecionado do sessionStorage
   * @returns {Object|null} - Objeto do projeto ou null se não houver projeto selecionado
   */
  getSelectedProject() {
    const projectData = sessionStorage.getItem('selectedProject')
    return projectData ? JSON.parse(projectData) : null
  }
}
