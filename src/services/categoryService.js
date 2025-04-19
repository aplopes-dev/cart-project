import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL
export const PLACEHOLDER_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzE0LTIyOjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDMtMjFUMTI6MjM6NDctMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDMtMjFUMTI6MjM6NDctMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAzLTIxVDEyOjIzOjQ3LTAzOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY2ZDk0ZmQ1LTNjMGItNDZiZi1hMzBhLTQ2NzI5ZjM2OTdiNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjY1ZWZkZjhiLTU1ZDAtYzU0Ny1i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SCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBkgrZRKSymzQEYplZFSpoG0UiotpcwAaaVUWkqZAdJKqbSUMgOklVJpKWUGSCul0lLKDJBWSqWllBk'
export const categoryService = {
  async getCategories() {
    try {
      // Usando o endpoint que retorna apenas categorias com produtos
      // Usando o endpoint que retorna apenas categorias com produtos
      const response = await axios.get(`${API_URL}/categories`)
      console.log('Categorias recebidas da API:', response.data.length)
      console.log('Categorias recebidas da API:', response.data.length)
      // Retorna diretamente response.data que já é o array de categorias
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async getAllCategories() {
    try {
      // Endpoint para uso administrativo que retorna todas as categorias
      const response = await axios.get(`${API_URL}/categories/admin/all`)
      return response.data
    } catch (error) {
      console.error('Error fetching all categories:', error)
      throw error
    }
  },

  async getPaginatedCategories(params = {}) {
    try {
      // Endpoint para obter categorias paginadas
      const { page = 1, limit = 10, includeInactive = false, onlyWithProducts = true, search = '' } = params
      // Converter explicitamente para string para garantir que o backend receba o valor correto
      const includeInactiveStr = includeInactive === true ? 'true' : 'false'

      const response = await axios.get(`${API_URL}/categories/paginated`, {
        params: {
          page,
          limit,
          includeInactive: includeInactiveStr, // Passar como string
          onlyWithProducts,
          search
        }
      })
      console.log('[categoryService] Categorias paginadas recebidas:', response.data)
      console.log('[categoryService] Total de categorias:', response.data.total)
      console.log('[categoryService] Total de páginas:', response.data.totalPages)
      return response.data
    } catch (error) {
      console.error('Error fetching paginated categories:', error)
      throw error
    }
  },

  /**
   * Busca categorias com base em um termo de busca, diretamente do backend
   * @param {string} searchTerm - Termo de busca para filtrar categorias
   * @param {boolean} onlyWithProducts - Se true, retorna apenas categorias com produtos
   * @returns {Promise<Array>} - Lista hierárquica de categorias que correspondem ao termo de busca
   */
  async searchCategories(searchTerm = '', onlyWithProducts = true) {
    try {
      console.log(`[categoryService] Buscando categorias com termo "${searchTerm}" e onlyWithProducts=${onlyWithProducts}`)

      // Parâmetros para a busca
      const params = {
        search: searchTerm,
        onlyWithProducts: onlyWithProducts,
        includeInactive: false, // Sempre busca apenas categorias ativas
        hierarchical: true // Indica ao backend para retornar a estrutura hierárquica
      }

      // Faz a requisição para o endpoint de busca de categorias
      const response = await axios.get(`${API_URL}/categories/search`, { params })

      return response.data
    } catch (error) {
      console.error('Error searching categories:', error)
      throw error
    }
  },

  async updateCategory(id, categoryData) {
    try {
      console.log(`[categoryService] Atualizando categoria ${id} com dados:`, categoryData)
      const response = await axios.patch(`${API_URL}/categories/${id}`, categoryData)
      console.log(`[categoryService] Resposta da API ao atualizar categoria ${id}:`, response.data)
      return response.data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  async getTopCategoriesWithMostProducts(limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/categories/top/with-most-products`, {
        params: { limit }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching top categories:', error)
      throw error
    }
  },

  /**
   * Verifica se uma categoria tem produtos diretamente ou através de suas subcategorias
   * @param {Object} category - A categoria a ser verificada
   * @param {Object} productCountMap - Mapa com a contagem de produtos por categoria
   * @param {string} parentPath - Caminho hierárquico da categoria (para log)
   * @returns {boolean} - True se a categoria tem produtos, false caso contrário
   */
  hasCategoryProducts(category, productCountMap = {}, parentPath = '') {
    const currentPath = parentPath ? `${parentPath} > ${category.name}` : category.name

    // Verifica se a categoria tem produtos diretamente
    if (productCountMap[category.id] && productCountMap[category.id] > 0) {
      console.log(`[categoryService] ✅ Categoria ${category.name} (ID: ${category.id}) tem ${productCountMap[category.id]} produtos diretamente. Caminho: ${currentPath}`)
      return true
    }

    // Verifica se alguma subcategoria tem produtos
    if (category.children && category.children.length > 0) {
      // Removido log desnecessário sobre verificação de subcategorias

      let hasProductsInChildren = false
      for (const child of category.children) {
        // Chamada recursiva para verificar subcategorias
        if (this.hasCategoryProducts(child, productCountMap, currentPath)) {
          // Removido log desnecessário sobre produtos em subcategorias
          hasProductsInChildren = true
          // Não retorna imediatamente para verificar todas as subcategorias (para fins de log)
        }
      }

      if (hasProductsInChildren) {
        return true
      }
    }

    console.log(`[categoryService] ❌ Categoria ${category.name} (ID: ${category.id}) não tem produtos nem subcategorias com produtos. Caminho: ${currentPath}`)
    return false
  },

  /**
   * Organiza as categorias em uma estrutura hierárquica
   * @param {Array} categories - Lista plana de categorias
   * @returns {Array} - Lista hierárquica de categorias
   */
  buildCategoryTree(categories) {
    if (!categories || !categories.length) return []

    // Removido log desnecessário sobre construção da árvore

    // Primeiro, criamos um mapa de todas as categorias por ID para fácil acesso
    const categoryMap = {}
    categories.forEach(category => {
      // Inicializa a propriedade children como um array vazio
      categoryMap[category.id] = { ...category, children: [], expanded: false }
    })

    // Depois, construímos a árvore
    const rootCategories = []

    categories.forEach(category => {
      // Se a categoria tem um parent_id e esse parent existe no mapa
      if (category.parent_id && categoryMap[category.parent_id]) {
        // Adiciona esta categoria como filho do parent
        categoryMap[category.parent_id].children.push(categoryMap[category.id])
        // Removido log desnecessário sobre hierarquização
      } else {
        // Se não tem parent_id ou o parent não existe, é uma categoria raiz
        rootCategories.push(categoryMap[category.id])
        // Removido log desnecessário sobre hierarquização
      }
    })

    // Removido log desnecessário sobre categorias raiz
    return rootCategories
  },

  /**
   * Filtra a árvore de categorias para manter apenas categorias com produtos
   * @param {Array} categoryTree - Árvore de categorias
   * @param {Object} productCountMap - Mapa com a contagem de produtos por categoria
   * @returns {Array} - Árvore de categorias filtrada
   */
  filterCategoryTree(categoryTree, productCountMap = {}) {
    if (!categoryTree || !categoryTree.length) return []

    // Removido log desnecessário sobre filtragem de categorias

    // Função recursiva para filtrar a árvore
    const filterTree = (tree) => {
      return tree.filter(category => {
        // Primeiro, filtra os filhos recursivamente
        if (category.children && category.children.length > 0) {
          category.children = filterTree(category.children)
        }

        // Verifica se a categoria tem produtos diretamente
        const hasDirectProducts = productCountMap[category.id] && productCountMap[category.id] > 0

        // Verifica se a categoria tem filhos com produtos
        const hasChildrenWithProducts = category.children && category.children.length > 0

        // Mantém a categoria se ela tem produtos diretamente OU se tem filhos (que já foram filtrados)
        const shouldKeep = hasDirectProducts || hasChildrenWithProducts

        // Removidos logs desnecessários sobre manter/remover categorias

        return shouldKeep
      })
    }

    const filteredTree = filterTree(categoryTree)
    // Removido log desnecessário sobre árvore filtrada

    return filteredTree
  },

  /**
   * Marca as categorias como expandidas quando uma categoria específica é selecionada
   * @param {Array} categoryTree - Árvore de categorias
   * @param {String} selectedCategoryId - ID da categoria selecionada
   * @returns {Array} - Árvore de categorias com as categorias expandidas
   */
  expandCategoriesForSelected(categoryTree, selectedCategoryId) {
    if (!categoryTree || !categoryTree.length || !selectedCategoryId) return categoryTree;

    // Removido log desnecessário sobre expansão de categorias

    // Cria uma cópia profunda da árvore para não modificar a original
    const treeCopy = JSON.parse(JSON.stringify(categoryTree));

    // Função recursiva para marcar as categorias como expandidas
    const markExpandedCategories = (tree, targetId, path = []) => {
      for (const category of tree) {
        // Adiciona a categoria atual ao caminho
        const currentPath = [...path, category];

        // Verifica se a categoria atual é a categoria selecionada
        if (category.id === targetId) {
          // Marca todas as categorias no caminho como expandidas
          for (const pathCategory of currentPath) {
            pathCategory.expanded = true;
          }
          return true;
        }

        // Se a categoria tem filhos, verifica recursivamente
        if (category.children && category.children.length > 0) {
          const found = markExpandedCategories(category.children, targetId, currentPath);
          if (found) {
            return true;
          }
        }
      }

      return false;
    };

    // Marca as categorias como expandidas
    markExpandedCategories(treeCopy, selectedCategoryId);

    return treeCopy;
  }
}




