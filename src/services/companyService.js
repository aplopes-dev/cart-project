import api from './api'

export const companyService = {
  /**
   * Get company information including contacts
   * @returns {Promise<Object>} Company information
   */
  async getCompanyInfo() {
    try {
      const response = await api.get('/settings/company')
      return response.data
    } catch (error) {
      console.error('Error fetching company information:', error)
      throw error
    }
  }
}

export default companyService
