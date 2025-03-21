import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export const productService = {
  async getProducts(filters = {}) {
    const { categoryId, brands, minPrice, maxPrice, page = 1, limit = 9, sortBy = 'featured' } = filters
    const response = await axios.get(`${API_URL}/products`, { 
      params: {
        categoryId,
        brands: brands?.join(','),
        minPrice,
        maxPrice,
        page,
        limit,
        sortBy
      }
    })
    return response.data
  },

  async getBrands() {
    const response = await axios.get(`${API_URL}/brands`)
    return response.data
  },

  async getBrandsByCategory(categoryId) {
    const response = await axios.get(`${API_URL}/products/brands-by-category/${categoryId}`)
    return response.data
  }
}





