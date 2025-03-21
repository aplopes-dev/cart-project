import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export const brandService = {
  async getAllBrands() {
    const response = await axios.get(`${API_URL}/brands`)
    return response.data
  }
}