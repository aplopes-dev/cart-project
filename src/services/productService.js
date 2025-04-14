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

    console.log('Enviando requisição para API com parâmetros:', {
      categoryId,
      brands: brands?.join(','),
      minPrice,
      maxPrice,
      page,
      limit,
      sortBy,
      search
    })

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

    console.log('Resposta da API:', response.data)
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

  async getPaginatedProducts(params = {}) {
    try {
      console.log('Buscando produtos paginados com parâmetros:', params)
      const response = await axios.get(`${API_URL}/products/paginated`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching paginated products:', error)
      throw error
    }
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
      const product = response.data

      // Se o produto tiver um código FoxPro, busca as imagens
      if (product.foxpro_code) {
        try {
          const imagesResponse = await this.getProductImages(product.foxpro_code);
          if (imagesResponse && imagesResponse.length > 0) {
            // Define a primeira imagem como a imagem principal se não houver uma definida
            if (!product.image) {
              product.image = imagesResponse[0];
            }
            // Adiciona todas as imagens ao array de imagens
            product.images = imagesResponse;
          }
        } catch (error) {
          console.error('Erro ao buscar imagens do produto:', error);
        }
      }

      return product
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  /**
   * Busca todas as imagens de um produto pelo foxpro_code
   * @param {string} foxproCode - Código FoxPro do produto
   * @returns {Promise<string[]>} - Array com os caminhos das imagens
   */
  async getProductImages(foxproCode) {
    if (!foxproCode) {
      return [];
    }

    try {
      const response = await axios.get(`${API_URL}/products/images/${foxproCode}`);
      return response.data.images || [];
    } catch (error) {
      console.error(`Erro ao buscar imagens para o produto com código ${foxproCode}:`, error);
      return [];
    }
  },

  async getProductDetails(id) {
    try {
      // Reutiliza o método getProductById para obter os detalhes do produto
      // Isso garante que as imagens também sejam carregadas
      return await this.getProductById(id);
    } catch (error) {
      console.error('Error fetching product details:', error)
      throw error
    }
  },

  async updateProduct(id, productData) {
    try {
      // Lista de propriedades conhecidas do modelo Product no backend
      const knownProperties = [
        'id', 'name', 'price', 'description_en', 'description_pt', 'description_fr',
        'technical_description_en', 'technical_description_pt', 'technical_description_fr',
        'image', 'images', 'foxpro_code', 'characteristics', 'isActive', 'categoryId', 'brandId',
        'createdAt', 'updatedAt'
      ]

      // Filtrar apenas propriedades conhecidas para evitar erros no backend
      const filteredProductData = {}
      for (const key in productData) {
        if (knownProperties.includes(key)) {
          filteredProductData[key] = productData[key]
        }
      }

      console.log(`Enviando requisição PATCH para ${API_URL}/products/${id} com dados filtrados:`, filteredProductData)
      const response = await axios.patch(`${API_URL}/products/${id}`, filteredProductData)
      console.log('Resposta da API após atualização do produto:', response.data)
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }
}









