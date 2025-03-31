import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export const productService = {
  async getProducts(filters = {}) {
    const {
      categoryId,
      brands,
      minPrice,
      maxPrice,
      page = 1,
      limit = 9,
      sortBy = 'featured',
      search  // Adicionando o parâmetro search
    } = filters

    const response = await axios.get(`${API_URL}/products`, {
      params: {
        categoryId,
        brands: brands?.join(','),
        minPrice,
        maxPrice,
        page,
        limit,
        sortBy,
        search  // Incluindo o parâmetro search na requisição
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
  },

  async getMaxPrice(categoryId = null, brands = []) {
    try {
      // Constrói os parâmetros da consulta
      const params = {};
      if (categoryId) params.categoryId = categoryId;
      if (brands && brands.length > 0) params.brands = brands.join(',');

      const response = await axios.get(`${API_URL}/products/max-price`, { params });
      console.log('Max price response:', response.data);

      // Retorna o preço máximo ou 3000 como valor padrão se não houver preço máximo
      // Aumentando o valor padrão para 3000 para garantir que produtos com preços maiores que 1000 sejam exibidos
      return response.data.maxPrice || 3000;
    } catch (error) {
      console.error('Error fetching max price:', error);
      // Em caso de erro, retorna um valor padrão mais alto
      return 3000;
    }
  },

  async getProductById(id) {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  async getProductDetails(id) {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product details:', error)
      throw error
    }
  }
}









