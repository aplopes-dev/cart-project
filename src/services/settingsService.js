import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export const settingsService = {
  async getFinancialSettings() {
    try {
      const response = await axios.get(`${API_URL}/settings/financial`)
      return response.data
    } catch (error) {
      console.error('Error fetching financial settings:', error)
      throw error
    }
  },

  async updateFinancialSettings(data) {
    try {
      const response = await axios.put(`${API_URL}/settings/financial`, data)
      return response.data
    } catch (error) {
      console.error('Error updating financial settings:', error)
      throw error
    }
  }
}


