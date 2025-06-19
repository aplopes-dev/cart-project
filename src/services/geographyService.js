import api from './api'

export const geographyService = {
  /**
   * Busca todos os países ativos
   */
  async getCountries() {
    try {
      const response = await api.get('/geography/countries')
      return response.data
    } catch (error) {
      console.error('Error fetching countries:', error)
      throw error
    }
  },

  /**
   * Busca um país por ID
   */
  async getCountryById(id) {
    try {
      const response = await api.get(`/geography/countries/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching country:', error)
      throw error
    }
  },

  /**
   * Busca estados/províncias de um país
   */
  async getProvincesByCountry(countryId) {
    try {
      const response = await api.get(`/geography/countries/${countryId}/provinces`)
      return response.data
    } catch (error) {
      console.error('Error fetching provinces:', error)
      throw error
    }
  },

  /**
   * Busca uma província/estado por ID
   */
  async getProvinceById(id) {
    try {
      const response = await api.get(`/geography/provinces/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching province:', error)
      throw error
    }
  },

  /**
   * Busca países com suas províncias/estados
   */
  async getCountriesWithProvinces() {
    try {
      const response = await api.get('/geography/countries-with-provinces')
      return response.data
    } catch (error) {
      console.error('Error fetching countries with provinces:', error)
      throw error
    }
  }
}
