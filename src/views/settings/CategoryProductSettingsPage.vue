<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-4 md:mb-8">
          <nav class="flex flex-wrap items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <router-link to="/settings" class="hover:text-black">
              {{ $t('systemSettings.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('systemSettings.categoryProduct') }}</span>
          </nav>
        </div>

        <!-- Título da Página -->
        <div class="mb-4 md:mb-8">
          <h1 class="font-archivo-narrow font-semibold text-xl md:text-3xl">
            {{ $t('systemSettings.categoryProduct') }}
          </h1>
          <p class="text-black/70 font-archivo mt-2">
            {{ $t('systemSettings.categoryProductDescription') }}
          </p>
        </div>

        <!-- Filtros e Pesquisa -->
        <div class="mb-3 md:mb-6 flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
          <div class="flex flex-col sm:flex-row gap-2 md:gap-4">
            <div class="relative">
              <div class="relative">
                <input
                  type="text"
                  v-model="searchQuery"
                  :placeholder="$t('systemSettings.searchCategories')"
                  class="w-full sm:w-[600px] p-2 border border-black/25 rounded font-archivo text-sm focus:outline-none focus:border-empire-yellow pr-8"
                  @input="debouncedSearch"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg class="w-4 h-4 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div class="mt-1 text-xs text-black/60 font-archivo">
                {{ $t('systemSettings.exactSearchTip') }}
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 md:gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs md:text-sm font-archivo">{{ $t('systemSettings.showDisabled') }}</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="showDisabled" class="sr-only peer" @change="loadCategories">
                <div class="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-empire-yellow"></div>
              </label>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs md:text-sm font-archivo">{{ $t('systemSettings.showOnlyWithProducts') }}</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="showOnlyWithProducts" class="sr-only peer" @change="loadCategories">
                <div class="w-9 h-5 md:w-11 md:h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 after:transition-all peer-checked:bg-empire-yellow"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Lista de Categorias -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-empire-yellow"></div>
        </div>

        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span class="block sm:inline">{{ error }}</span>
        </div>

        <div v-else-if="filteredCategories.length === 0" class="text-center py-12">
          <p class="text-black/70 font-archivo">{{ $t('systemSettings.noCategories') }}</p>
        </div>

        <div v-else class="space-y-4">
          <!-- Paginação Superior -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div class="flex items-center gap-4">
              <div class="text-xs md:text-sm text-black/70 font-archivo">
                {{ $t('pagination.showing') }} {{ totalItems > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0 }} -
                {{ totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0 }}
                {{ $t('pagination.of') }} {{ totalItems }} (Página {{ currentPage }} de {{ totalPages }})
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs md:text-sm text-black/70 font-archivo">{{ $t('pagination.itemsPerPage') }}:</span>
                <select
                  v-model="itemsPerPage"
                  class="border border-black/25 rounded px-1 md:px-2 py-0.5 md:py-1 text-xs md:text-sm font-archivo"
                  @change="currentPage = 1"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                </select>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-2 md:px-3 py-0.5 md:py-1 border border-black/25 rounded text-xs md:text-sm font-archivo"
                :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'"
              >
                {{ $t('pagination.prev') }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage >= Number(totalPages)"
                class="px-2 md:px-3 py-0.5 md:py-1 border border-black/25 rounded text-xs md:text-sm font-archivo"
                :class="currentPage >= Number(totalPages) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'"
              >
                {{ $t('pagination.next') }}
              </button>
            </div>
          </div>

          <!-- Lista de Categorias -->
          <div class="space-y-4">
            <category-tree-item
              v-for="category in filteredCategories"
              :key="category.id"
              :category="category"
              :expanded-category-id="expandedCategory"
              @toggle-status="toggleCategoryStatus"
              @show-products="expandCategory"
              @toggle-expanded="toggleCategoryExpanded"
            >
              <template #products>
                <div v-if="loadingProducts" class="flex justify-center items-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-empire-yellow"></div>
                </div>

                <div v-else-if="categoryProducts.length === 0" class="text-center py-8">
                  <p class="text-black/70 font-archivo">{{ $t('systemSettings.noProducts') }}</p>
                </div>

                <div v-else>
                  <!-- Pesquisa de Produtos -->
                  <div class="mb-4 flex justify-between items-center">
                    <div class="relative w-full sm:w-64">
                      <input
                        type="text"
                        v-model="productSearchQuery"
                        :placeholder="$t('systemSettings.searchProducts')"
                        class="w-full p-2 border border-black/25 rounded font-archivo text-sm focus:outline-none focus:border-empire-yellow pr-8"
                        @input="debouncedProductSearch"
                      />
                      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg class="w-4 h-4 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    <!-- Paginação de Produtos -->
                    <div class="flex items-center gap-4">
                      <div class="hidden sm:flex items-center gap-4">
                        <div class="text-sm text-black/70 font-archivo">
                          {{ $t('pagination.showing') }} {{ productTotalItems > 0 ? (productCurrentPage - 1) * productItemsPerPage + 1 : 0 }} -
                          {{ productTotalItems > 0 ? Math.min(productCurrentPage * productItemsPerPage, productTotalItems) : 0 }}
                          {{ $t('pagination.of') }} {{ productTotalItems }} (Página {{ productCurrentPage }} de {{ productTotalPages }})
                        </div>

                        <div class="flex items-center gap-2">
                          <span class="text-sm text-black/70 font-archivo">{{ $t('pagination.itemsPerPage') }}:</span>
                          <select
                            v-model="productItemsPerPage"
                            class="border border-black/25 rounded px-2 py-1 text-sm font-archivo"
                            @change="productCurrentPage = 1; if (expandedCategory.value) loadCategoryProducts(expandedCategory.value, true)"
                          >
                            <option :value="5">5</option>
                            <option :value="10">10</option>
                            <option :value="20">20</option>
                            <option :value="50">50</option>
                          </select>
                        </div>
                      </div>
                      <div class="hidden sm:flex gap-2">
                        <button
                          @click="prevProductPage"
                          :disabled="productCurrentPage === 1"
                          class="px-3 py-1 border border-black/25 rounded text-sm font-archivo"
                          :class="productCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'"
                        >
                          {{ $t('pagination.prev') }}
                        </button>
                        <button
                          @click="nextProductPage"
                          :disabled="productCurrentPage >= productTotalPages"
                          class="px-3 py-1 border border-black/25 rounded text-sm font-archivo"
                          :class="productCurrentPage >= productTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'"
                        >
                          {{ $t('pagination.next') }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Tabela de Produtos -->
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-black/10">
                      <thead class="bg-gray-100">
                        <tr>
                          <th scope="col" class="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold font-archivo-narrow text-black/70 uppercase tracking-wider">
                            {{ $t('systemSettings.product') }}
                          </th>
                          <th scope="col" class="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold font-archivo-narrow text-black/70 uppercase tracking-wider">
                            {{ $t('systemSettings.sku') }}
                          </th>
                          <th scope="col" class="px-2 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold font-archivo-narrow text-black/70 uppercase tracking-wider">
                            {{ $t('systemSettings.price') }}
                          </th>
                          <th scope="col" class="px-2 md:px-4 py-2 md:py-3 text-right text-[10px] md:text-xs font-semibold font-archivo-narrow text-black/70 uppercase tracking-wider">
                            {{ $t('systemSettings.status') }}
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-black/10">
                        <tr v-for="product in paginatedProducts" :key="product.id" :class="{ 'opacity-70': !product.isActive, 'bg-yellow-50 transition-colors duration-500': product.recentlyUpdated }">
                          <td class="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap">
                            <div class="flex items-center">
                              <div class="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden mr-2 md:mr-3">
                                <img
                                  :src="getProductImage(product.image, product)"
                                  :alt="product.name"
                                  class="w-full h-full object-cover"
                                  @error="handleImageError"
                                />
                              </div>
                              <div class="font-archivo text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                                {{ product.name }}
                              </div>
                            </div>
                          </td>
                          <td class="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap font-archivo text-xs md:text-sm text-black/70">
                            {{ product.sku || product.foxpro_code || '-' }}
                          </td>
                          <td class="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap font-archivo text-xs md:text-sm text-black/70">
                            {{ formatPrice(product.price) }}
                          </td>
                          <td class="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap text-right">
                            <div class="flex items-center justify-end gap-2">
                              <span class="text-xs font-archivo">{{ product.isActive ? $t('systemSettings.enabled') : $t('systemSettings.disabled') }}</span>
                              <label class="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  :checked="product.isActive"
                                  class="sr-only peer"
                                  @change="toggleProductStatus(product)"
                                >
                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-empire-yellow"></div>
                              </label>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Paginação de Produtos (Mobile) -->
                  <div class="flex flex-col sm:hidden items-center mt-4 gap-2">
                    <div class="text-xs md:text-sm text-black/70 font-archivo mb-1 md:mb-2">
                      {{ $t('pagination.showing') }} {{ productTotalItems > 0 ? (productCurrentPage - 1) * productItemsPerPage + 1 : 0 }} -
                      {{ productTotalItems > 0 ? Math.min(productCurrentPage * productItemsPerPage, productTotalItems) : 0 }}
                      {{ $t('pagination.of') }} {{ productTotalItems }} (Página {{ productCurrentPage }} de {{ productTotalPages }})
                    </div>

                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-xs md:text-sm text-black/70 font-archivo">{{ $t('pagination.itemsPerPage') }}:</span>
                      <select
                        v-model="productItemsPerPage"
                        class="border border-black/25 rounded px-1 md:px-2 py-0.5 md:py-1 text-xs md:text-sm font-archivo"
                        @change="productCurrentPage = 1; if (expandedCategory.value) loadCategoryProducts(expandedCategory.value, true)"
                      >
                        <option :value="5">5</option>
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                      </select>
                    </div>
                    <div class="flex gap-2">
                      <button
                        @click="prevProductPage"
                        :disabled="productCurrentPage === 1"
                        class="px-2 md:px-3 py-0.5 md:py-1 border border-black/25 rounded text-xs md:text-sm font-archivo"
                        :class="productCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'"
                      >
                        {{ $t('pagination.prev') }}
                      </button>
                      <button
                        @click="nextProductPage"
                        :disabled="productCurrentPage >= productTotalPages"
                        class="px-2 md:px-3 py-0.5 md:py-1 border border-black/25 rounded text-xs md:text-sm font-archivo"
                        :class="productCurrentPage >= productTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'"
                      >
                        {{ $t('pagination.next') }}
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </category-tree-item>
          </div>

          <!-- Paginação Inferior -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-2">
            <div class="flex items-center gap-4">
              <div class="text-xs md:text-sm text-black/70 font-archivo">
                {{ $t('pagination.showing') }} {{ totalItems > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0 }} -
                {{ totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0 }}
                {{ $t('pagination.of') }} {{ totalItems }} (Página {{ currentPage }} de {{ totalPages }})
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs md:text-sm text-black/70 font-archivo">{{ $t('pagination.itemsPerPage') }}:</span>
                <select
                  v-model="itemsPerPage"
                  class="border border-black/25 rounded px-1 md:px-2 py-0.5 md:py-1 text-xs md:text-sm font-archivo"
                  @change="currentPage = 1"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                </select>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-2 md:px-3 py-0.5 md:py-1 border border-black/25 rounded text-xs md:text-sm font-archivo"
                :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'"
              >
                {{ $t('pagination.prev') }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage >= Number(totalPages)"
                class="px-2 md:px-3 py-0.5 md:py-1 border border-black/25 rounded text-xs md:text-sm font-archivo"
                :class="currentPage >= Number(totalPages) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/5'"
              >
                {{ $t('pagination.next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { categoryService } from '@/services/categoryService'
import { productService } from '@/services/productService'
import { useToast } from '@/composables/useToast'
import CategoryTreeItem from '@/components/CategoryTreeItem.vue'
import { imageService } from '@/services/imageService'

export default {
  name: 'CategoryProductSettingsPage',
  components: {
    CategoryTreeItem
  },
  setup() {
    const { t } = useI18n()
    const { showToast } = useToast()

    // Estado para categorias
    const categories = ref([])
    const loading = ref(true)
    const error = ref(null)
    const searchQuery = ref('')
    const showDisabled = ref(true)
    const showOnlyWithProducts = ref(true) // Ativado por padrão
    const totalItems = ref(0)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const expandedCategory = ref(null)

    // Estado para produtos
    const categoryProducts = ref([])
    const loadingProducts = ref(false)
    const productSearchQuery = ref('')
    const productCurrentPage = ref(1)
    const productItemsPerPage = ref(10)
    const productTotalItems = ref(0)

    // Computed para o total de páginas de produtos
    const productTotalPages = computed(() => {
      return Math.ceil(productTotalItems.value / productItemsPerPage.value)
    })

    // Debounce para pesquisa
    let searchTimeout = null
    let productSearchTimeout = null

    // Garantir que todas as categorias estejam contraídas
    const collapseAllCategories = (categories) => {
      if (!categories || !Array.isArray(categories)) return

      categories.forEach(category => {
        // Adicionar a propriedade expanded se não existir
        if (typeof category.expanded === 'undefined') {
          category.expanded = false
          // console.log(`Inicializando expanded para ${category.name}: false`)
        } else {
          category.expanded = false
          // console.log(`Definindo expanded para ${category.name}: false`)
        }

        if (category.children && category.children.length) {
          collapseAllCategories(category.children)
        }
      })
    }



    // Carregar categorias
    const loadCategories = async () => {
      try {
        loading.value = true
        error.value = null

        // Preparar parâmetros para a requisição
        const params = {
          page: currentPage.value,
          limit: itemsPerPage.value,
          includeInactive: showDisabled.value,
          onlyWithProducts: showOnlyWithProducts.value,
          search: searchQuery.value
        }

        console.log('Carregando categorias com parâmetros:', params)
        console.log('Mostrando apenas categorias com produtos:', showOnlyWithProducts.value)
        console.log(`Realizando busca com termo '${searchQuery.value}' e onlyWithProducts=${showOnlyWithProducts.value}`)

        // Usar o novo endpoint paginado
        console.log('Chamando API para buscar categorias paginadas...')
        const response = await categoryService.getPaginatedCategories(params)
        console.log('Resposta da API recebida:', response)

        console.log(`Categorias carregadas: ${response.items.length} de ${response.total} (página ${response.page} de ${response.totalPages})`)

        // Atualizar o total de itens
        const { items, total } = response

        // Verificar se as categorias vieram com a propriedade expanded
        if (items && items.length > 0) {
          console.log('Primeira categoria recebida do backend:', items[0])
          if (items[0].children && items[0].children.length > 0) {
            console.log('Primeiro filho da primeira categoria:', items[0].children[0])
          }
        }

        // Preservar o estado de expansão das categorias existentes
        const preserveExpansionState = (newCategories, oldCategories) => {
          if (!oldCategories || !oldCategories.length) return newCategories

          // Criar um mapa de categorias antigas por ID para acesso rápido
          const oldCategoryMap = {}

          // Função para preencher o mapa recursivamente
          const fillMap = (categories) => {
            categories.forEach(cat => {
              oldCategoryMap[cat.id] = cat
              if (cat.children && cat.children.length > 0) {
                fillMap(cat.children)
              }
            })
          }

          // Preencher o mapa com todas as categorias antigas
          fillMap(oldCategories)

          // Função para atualizar o estado de expansão recursivamente
          const updateExpansionState = (categories) => {
            return categories.map(newCat => {
              // Se estamos fazendo uma busca, respeitar o estado de expansão que vem do backend
              if (searchQuery.value.trim()) {
                // Manter o estado de expansão que vem do backend
                console.log(`Respeitando estado de expansão do backend para ${newCat.name}: ${newCat.expanded}`)
              } else {
                // Se não estamos fazendo uma busca, usar o estado de expansão anterior
                // Procurar a categoria correspondente no mapa
                const oldCat = oldCategoryMap[newCat.id]

                // Se encontrou e tem estado de expansão definido, preservar
                if (oldCat && typeof oldCat.expanded !== 'undefined') {
                  newCat.expanded = oldCat.expanded
                  // console.log(`Preservando estado de expansão para ${newCat.name}: ${newCat.expanded}`)
                } else {
                  // Inicializar o estado de expansão como false se não estiver definido
                  newCat.expanded = newCat.expanded || false
                  // console.log(`Inicializando estado de expansão para ${newCat.name}: ${newCat.expanded}`)
                }
              }

              // Processar recursivamente os filhos
              if (newCat.children && newCat.children.length > 0) {
                newCat.children = updateExpansionState(newCat.children)
              }

              return newCat
            })
          }

          // Atualizar o estado de expansão de todas as categorias novas
          return updateExpansionState(newCategories)
        }

        // Preservar o estado de expansão e atualizar as categorias
        categories.value = preserveExpansionState(items, categories.value)

        // Verificar o estado das categorias após a função preserveExpansionState
        if (categories.value && categories.value.length > 0) {
          console.log('Primeira categoria após preserveExpansionState:', categories.value[0])
          if (categories.value[0].children && categories.value[0].children.length > 0) {
            console.log('Primeiro filho da primeira categoria após preserveExpansionState:', categories.value[0].children[0])
          }
        }

        // Atualizar o total de itens
        totalItems.value = total
        // Não precisamos mais atualizar totalPages, pois agora é um computed

        // Inicializar o estado de expansão das categorias
        // Colapsar automaticamente todas as categorias apenas se não estamos fazendo uma busca
        if (!searchQuery.value.trim()) {
          collapseAllCategories(categories.value)
        }
      } catch (err) {
        console.error('Error loading categories:', err)
        error.value = t('systemSettings.errorLoadingCategories')
      } finally {
        loading.value = false
      }
    }

    // Carregar produtos de uma categoria
    const loadCategoryProducts = async (categoryId, resetPage = true) => {
      try {
        loadingProducts.value = true
        if (resetPage) {
          productCurrentPage.value = 1
          // Limpar o termo de busca quando resetPage é true e estamos mudando de categoria
          if (expandedCategory.value !== categoryId) {
            console.log(`Mudando de categoria ${expandedCategory.value} para ${categoryId}, limpando termo de busca`)
            productSearchQuery.value = ''
          }
        }

        // Buscar produtos da categoria usando o endpoint paginado
        const params = {
          categoryId,
          page: productCurrentPage.value,
          limit: productItemsPerPage.value
        }

        // Adicionar termo de pesquisa se existir
        if (productSearchQuery.value.trim()) {
          params.search = productSearchQuery.value.trim()
          console.log(`Adicionando termo de busca: "${params.search}"`)
        } else {
          console.log('Nenhum termo de busca especificado')
        }

        console.log('Buscando produtos com parâmetros:', params)
        const response = await productService.getPaginatedProducts(params)

        console.log(`Produtos carregados: ${response.items.length} de ${response.total} (página ${response.page} de ${response.totalPages})`)
        categoryProducts.value = response.items || []
        productTotalItems.value = response.total
      } catch (err) {
        console.error('Error loading category products:', err)
        categoryProducts.value = []
        productTotalItems.value = 0
      } finally {
        loadingProducts.value = false
      }
    }

    // Expandir/colapsar categoria na árvore
    const toggleCategoryExpanded = (category) => {
      // Inicializar o estado de expansão se não estiver definido
      if (typeof category.expanded === 'undefined') {
        category.expanded = true
      } else {
        category.expanded = !category.expanded

        // Se a categoria está sendo retraída e os produtos estão sendo exibidos, ocultar os produtos
        if (!category.expanded && expandedCategory.value === category.id) {
          expandedCategory.value = null
        }
      }

      // Encontrar e atualizar a categoria no array original
      const findAndUpdateCategory = (cats, targetId, newExpandedState) => {
        for (let i = 0; i < cats.length; i++) {
          if (cats[i].id === targetId) {
            // Atualizar o estado de expansão
            cats[i].expanded = newExpandedState
            return true
          }

          // Buscar recursivamente nos filhos
          if (cats[i].children && cats[i].children.length > 0) {
            if (findAndUpdateCategory(cats[i].children, targetId, newExpandedState)) {
              return true
            }
          }
        }
        return false
      }

      // Atualizar a categoria no array original
      findAndUpdateCategory(categories.value, category.id, category.expanded)

      // Forçar a atualização da interface
      // Isso é necessário porque o Vue pode não detectar mudanças em objetos aninhados
      categories.value = [...categories.value]
    }

    // Expandir/colapsar categoria para mostrar produtos
    const expandCategory = async (category) => {
      if (expandedCategory.value === category.id) {
        expandedCategory.value = null
      } else {
        // Limpar o termo de busca quando muda de categoria
        productSearchQuery.value = ''

        expandedCategory.value = category.id
        await loadCategoryProducts(category.id, true) // Usar resetPage = true para garantir que a página seja resetada
      }
    }

    // Toggle status da categoria
    const toggleCategoryStatus = async (category) => {
      try {
        const newStatus = !category.isActive
        console.log(`Alterando status da categoria ${category.name} (ID: ${category.id}) para ${newStatus ? 'ativo' : 'inativo'}`)
        console.log(`Categoria atual:`, category)

        // Atualizar a categoria no backend
        console.log(`Enviando requisição para atualizar categoria ${category.id} no backend...`)
        await categoryService.updateCategory(category.id, {
          ...category,
          isActive: newStatus
        })
        console.log(`Categoria ${category.id} atualizada com sucesso no backend`)

        // Função para encontrar e atualizar uma categoria na árvore
        const findAndUpdateCategory = (tree, categoryId, updateFn) => {
          return tree.map(cat => {
            // Criar uma cópia da categoria para não modificar a original diretamente
            const updatedCat = { ...cat }

            // Se esta é a categoria que estamos procurando, atualizá-la
            if (updatedCat.id === categoryId) {
              updateFn(updatedCat)
            }

            // Atualizar filhos recursivamente
            if (updatedCat.children && updatedCat.children.length) {
              updatedCat.children = findAndUpdateCategory(updatedCat.children, categoryId, updateFn)
            }

            return updatedCat
          })
        }

        // Função para encontrar todas as categorias filhas recursivamente
        const findAllChildren = (tree, categoryId) => {
          const result = []

          // Função auxiliar para buscar filhos em uma árvore
          const findChildrenInTree = (categories, parentId) => {
            for (const cat of categories) {
              // Se esta categoria é filha do pai que estamos procurando
              if (cat.parent_id === parentId) {
                result.push(cat)
                // Buscar recursivamente os filhos desta categoria
                if (cat.children && cat.children.length > 0) {
                  findChildrenInTree(cat.children, cat.id)
                }
              }
              // Continuar buscando nos filhos desta categoria
              else if (cat.children && cat.children.length > 0) {
                findChildrenInTree(cat.children, parentId)
              }
            }
          }

          // Iniciar a busca na árvore principal
          findChildrenInTree(tree, categoryId)

          console.log(`findAllChildren: Encontradas ${result.length} categorias filhas para o ID ${categoryId}`)
          return result
        }

        // Função para encontrar todos os pais até a raiz
        const findAllParents = (tree, categoryId) => {
          const result = []

          // Função para encontrar uma categoria por ID
          const findCategoryById = (tree, id) => {
            for (const cat of tree) {
              if (cat.id === id) {
                return cat
              }
              if (cat.children && cat.children.length) {
                const found = findCategoryById(cat.children, id)
                if (found) return found
              }
            }
            return null
          }

          // Encontrar a categoria atual
          let currentCategory = findCategoryById(tree, categoryId)

          // Percorrer a árvore até a raiz
          while (currentCategory && currentCategory.parent_id) {
            const parent = findCategoryById(tree, currentCategory.parent_id)
            if (parent) {
              result.push(parent)
              currentCategory = parent
            } else {
              break
            }
          }

          return result
        }

        // Atualizar a categoria na árvore local
        let updatedTree = findAndUpdateCategory(categories.value, category.id, (cat) => {
          cat.isActive = newStatus
        })

        // Se estamos desabilitando, atualizar todas as filhas
        if (!newStatus) {
          const children = findAllChildren(categories.value, category.id)
          console.log(`Encontradas ${children.length} categorias filhas para desabilitar localmente`)

          children.forEach(child => {
            updatedTree = findAndUpdateCategory(updatedTree, child.id, (cat) => {
              cat.isActive = false
            })
          })
        }
        // Se estamos habilitando
        else {
          // Verificar se a categoria tem um pai
          const hasParent = category.parent_id !== null && category.parent_id !== undefined

          // Verificar se a categoria tem filhos
          const children = findAllChildren(categories.value, category.id)
          const hasChildren = children.length > 0
          console.log(`Categoria ${category.name} (ID: ${category.id}) tem pai: ${hasParent}, tem filhos: ${hasChildren}`)

          // Se a categoria tem um pai, habilitar todos os pais
          if (hasParent) {
            const parents = findAllParents(categories.value, category.id)
            console.log(`Encontrados ${parents.length} categorias pais para habilitar localmente`)

            parents.forEach(parent => {
              updatedTree = findAndUpdateCategory(updatedTree, parent.id, (cat) => {
                cat.isActive = true
              })
            })
          }

          // Se a categoria tem filhos, habilitar todas as filhas
          if (hasChildren) {
            console.log(`Habilitando categoria ${category.name} (ID: ${category.id}) e todas as suas filhas`)
            console.log(`Árvore de categorias tem ${categories.value.length} categorias no total`)
            console.log(`Encontradas ${children.length} categorias filhas para habilitar localmente`)

            if (children.length > 0) {
              console.log(`Nomes das filhas: ${children.map(c => c.name).join(', ')}`)
            }

            children.forEach(child => {
              console.log(`Habilitando categoria filha: ${child.name} (ID: ${child.id})`)
              updatedTree = findAndUpdateCategory(updatedTree, child.id, (cat) => {
                cat.isActive = true
              })
            })
          } else {
            console.log(`Categoria ${category.name} (ID: ${category.id}) não tem filhos. Não há filhas para habilitar.`)
          }
        }

        // Atualizar a árvore de categorias
        categories.value = updatedTree

        showToast(
          newStatus
            ? t('systemSettings.categoryEnabled')
            : t('systemSettings.categoryDisabled')
        )
      } catch (err) {
        console.error('Error toggling category status:', err)
        showToast(t('systemSettings.errorUpdatingCategory'), 'error')
      }
    }

    // Toggle status do produto
    const toggleProductStatus = async (product) => {
      try {
        const newStatus = !product.isActive
        console.log(`Alterando status do produto ${product.name} (ID: ${product.id}) para ${newStatus ? 'ativo' : 'inativo'}`)
        console.log(`Produto atual:`, product)

        // Criar uma cópia do produto sem a propriedade recentlyUpdated
        const productToUpdate = { ...product }
        // Remover a propriedade recentlyUpdated para não enviar ao backend
        delete productToUpdate.recentlyUpdated

        // Atualizar no backend
        console.log(`Enviando requisição para atualizar produto ${product.id} no backend...`)
        const updatedProduct = await productService.updateProduct(product.id, {
          ...productToUpdate,
          isActive: newStatus
        })
        console.log(`Produto ${product.id} atualizado com sucesso no backend:`, updatedProduct)

        // Atualizar o produto localmente em vez de recarregar todos os produtos
        const productIndex = categoryProducts.value.findIndex(p => p.id === product.id)
        if (productIndex !== -1) {
          // Criar uma cópia do array para forçar a reatividade
          const updatedProducts = [...categoryProducts.value]
          // Adicionar propriedade para indicar que o produto foi atualizado recentemente
          updatedProduct.recentlyUpdated = true

          // Substituir o produto antigo pelo atualizado
          updatedProducts[productIndex] = updatedProduct
          // Atualizar o estado
          categoryProducts.value = updatedProducts
          console.log(`Produto atualizado localmente no índice ${productIndex}`);

          // Mostrar toast de sucesso
          showToast({
            message: newStatus
              ? t('systemSettings.productActivated', { name: product.name })
              : t('systemSettings.productDeactivated', { name: product.name }),
            type: 'success',
            duration: 3000
          });

          // Remover a marcação de atualização recente após 1.5 segundos
          setTimeout(() => {
            const productToUpdate = categoryProducts.value.find(p => p.id === updatedProduct.id);
            if (productToUpdate) {
              productToUpdate.recentlyUpdated = false;
              // Forçar a reatividade
              categoryProducts.value = [...categoryProducts.value];
              console.log(`Removida marcação de atualização recente do produto ${updatedProduct.id}`);
            }
          }, 1500);
        } else {
          console.warn(`Produto com ID ${product.id} não encontrado na lista local`);
        }

        showToast(
          newStatus
            ? t('systemSettings.productEnabled')
            : t('systemSettings.productDisabled')
        )
      } catch (err) {
        console.error('Error toggling product status:', err)
        showToast(t('systemSettings.errorUpdatingProduct'), 'error')
      }
    }

    // Pesquisa com debounce
    const debouncedSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        // Resetar a página atual para a primeira página
        currentPage.value = 1

        // Recarregar categorias do backend com o termo de busca
        // O parâmetro onlyWithProducts é passado automaticamente em loadCategories
        loadCategories()

        // Se o termo de busca estiver vazio, colapsar todas as categorias
        if (!searchQuery.value.trim()) {
          collapseAllCategories(categories.value)
        }
      }, 300)
    }

    // Pesquisa de produtos com debounce
    const debouncedProductSearch = () => {
      clearTimeout(productSearchTimeout)
      productSearchTimeout = setTimeout(() => {
        productCurrentPage.value = 1
        // Recarregar produtos quando a pesquisa muda
        if (expandedCategory.value) {
          console.log(`Pesquisando produtos na categoria ${expandedCategory.value} com termo "${productSearchQuery.value}"`)
          loadCategoryProducts(expandedCategory.value, false) // Usar resetPage = false para não limpar o termo de busca
        }
      }, 300)
    }

    // Filtrar categorias na árvore
    const filterCategoryTree = (categoryTree, searchTerm, filterInactive = false, onlyWithProducts = false) => {
      if (!categoryTree || !categoryTree.length) return []

      return categoryTree.reduce((filtered, category) => {
        // Cria uma cópia profunda da categoria para não modificar a original
        // Isso garante que todas as propriedades, incluindo o estado de expansão, sejam preservadas
        const categoryCopy = JSON.parse(JSON.stringify(category))

        // Se estamos filtrando categorias inativas e esta categoria está inativa, pular
        if (filterInactive && !categoryCopy.isActive) {
          return filtered
        }

        // Se estamos filtrando apenas categorias com produtos e esta categoria não tem produtos, pular
        if (onlyWithProducts && categoryCopy.has_products === false) {
          return filtered
        }

        // Verifica se a categoria corresponde ao termo de pesquisa
        let matchesSearch = false;

        // Verificar se o termo de busca está entre aspas duplas para busca exata
        const isExactSearch = searchTerm.startsWith('"') && searchTerm.endsWith('"');
        let searchTermProcessed = searchTerm;

        if (isExactSearch) {
          // Remover as aspas para a busca exata
          searchTermProcessed = searchTerm.slice(1, -1).toLowerCase().trim();
          console.log(`[BUSCA EXATA FRONTEND] Termo sem aspas: "${searchTermProcessed}"`);

          // Busca exata - deve corresponder exatamente ao nome da categoria
          matchesSearch = !searchTermProcessed ||
            categoryCopy.name.toLowerCase().trim() === searchTermProcessed ||
            (categoryCopy.description && categoryCopy.description.toLowerCase().trim() === searchTermProcessed);

          console.log(`[BUSCA EXATA FRONTEND] Comparando "${categoryCopy.name}" com "${searchTermProcessed}": ${matchesSearch}`);
        } else {
          // Busca parcial - contém o termo de busca
          matchesSearch = !searchTerm ||
            categoryCopy.name.toLowerCase().includes(searchTerm) ||
            (categoryCopy.description && categoryCopy.description.toLowerCase().includes(searchTerm));
        }

        // Filtra os filhos recursivamente
        let hasMatchingChildren = false
        if (categoryCopy.children && categoryCopy.children.length) {
          categoryCopy.children = filterCategoryTree(categoryCopy.children, searchTerm, filterInactive)
          hasMatchingChildren = categoryCopy.children.length > 0
        }

        // Se a categoria corresponde à pesquisa ou tem filhos que correspondem
        if (matchesSearch || hasMatchingChildren) {
          // Se a categoria tem filhos que correspondem à pesquisa, expandir automaticamente
          if (hasMatchingChildren && searchTerm) {
            categoryCopy.expanded = true
          }

          // Se a categoria corresponde diretamente à pesquisa, expandir ela e seus pais
          if (matchesSearch && searchTerm) {
            categoryCopy.expanded = true
          }

          filtered.push(categoryCopy)
        }

        return filtered
      }, [])
    }

    // Filtrar categorias
    const filteredCategories = computed(() => {
      // Filtrar por termo de pesquisa
      const searchTerm = searchQuery.value.trim().toLowerCase()

      // Determinar se devemos filtrar categorias inativas
      const filterInactive = !showDisabled.value

      // Determinar se devemos filtrar apenas categorias com produtos
      const filterOnlyWithProducts = showOnlyWithProducts.value

      // Verificar se o termo de busca está entre aspas duplas para busca exata
      const isExactSearch = searchTerm.startsWith('"') && searchTerm.endsWith('"');
      console.log(`[FILTRO FRONTEND] Termo de busca: '${searchTerm}', isExactSearch: ${isExactSearch}`);

      // Aplicar o filtro mantendo a estrutura hierárquica
      const filtered = filterCategoryTree(categories.value, searchTerm, filterInactive, filterOnlyWithProducts)

      console.log(`Filtrando categorias: termo de busca = '${searchTerm}', filtrar inativas = ${filterInactive}, apenas com produtos = ${filterOnlyWithProducts}, categorias originais = ${categories.value.length}, categorias filtradas = ${filtered.length}`)

      // Função para encontrar categorias com "Lavabo" no nome recursivamente
      const findLavaboCategoriesRecursive = (categories) => {
        if (!categories || !Array.isArray(categories)) return [];

        let result = [];

        for (const category of categories) {
          if (category.name.includes('Lavabo')) {
            result.push(category);
          }

          // Buscar recursivamente nos filhos
          if (category.children && category.children.length > 0) {
            result = [...result, ...findLavaboCategoriesRecursive(category.children)];
          }
        }

        return result;
      };

      // Verificar se há categorias com "Lavabo" no nome (incluindo filhos)
      const lavaboCats = findLavaboCategoriesRecursive(filtered);
      if (lavaboCats.length > 0) {
        console.log(`[FILTRO FRONTEND] Categorias Lavabo encontradas após filtro: ${lavaboCats.map(c => `"${c.name}"`).join(', ')}`);
      } else if (searchTerm.includes('Lavabo')) {
        console.log(`[FILTRO FRONTEND] Nenhuma categoria Lavabo encontrada após filtro com termo '${searchTerm}'`);

        // Verificar se há categorias com "Lavabo" no nome antes do filtro
        const originalLavaboCats = findLavaboCategoriesRecursive(categories.value);
        if (originalLavaboCats.length > 0) {
          console.log(`[FILTRO FRONTEND] Categorias Lavabo existentes antes do filtro: ${originalLavaboCats.map(c => `"${c.name}"`).join(', ')}`);
        } else {
          console.log(`[FILTRO FRONTEND] Nenhuma categoria Lavabo encontrada antes do filtro`);
        }
      }

      return filtered
    })

    // Função para achatar a árvore de categorias
    const flattenCategoryTree = (tree, level = 0) => {
      if (!tree || !Array.isArray(tree)) return []

      const result = tree.reduce((acc, category) => {
        if (!category) return acc

        // Adiciona a categoria atual com seu nível
        acc.push({ ...category, level })

        // Se a categoria estiver expandida e tiver filhos, adiciona os filhos recursivamente
        if (category.expanded && category.children && category.children.length) {
          acc.push(...flattenCategoryTree(category.children, level + 1))
        }

        return acc
      }, [])

      // if (level === 0) {
      //   console.log('flattenCategoryTree', 'input tree size:', tree.length, 'output flattened size:', result.length)
      // }

      return result
    }

    // Achatar a árvore de categorias para paginação
    const flattenedCategories = computed(() => {
      const flattened = flattenCategoryTree(filteredCategories.value) || []
      // console.log('flattenedCategories computed', 'filtered categories (hierarchical):', filteredCategories.value.length, 'flattened categories:', flattened.length)
      return flattened
    })

    // Paginação de categorias
    const totalPages = computed(() => {
      // Usar o total de itens do backend, não o número de categorias que recebemos
      const total = totalItems.value || 0
      const pages = total > 0 ? Math.max(1, Math.ceil(total / itemsPerPage.value)) : 1
      // console.log('totalPages computed', 'total items (backend):', total, 'items per page:', itemsPerPage.value, 'pages:', pages)
      return pages
    })

    // Ajustar página atual quando necessário
    watch(() => totalPages.value, (newTotalPages) => {
      if (currentPage.value > newTotalPages) {
        currentPage.value = newTotalPages
      }
    })

    const paginatedCategories = computed(() => {
      if (!flattenedCategories.value.length) return []

      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      const paginated = flattenedCategories.value.slice(start, end)

      // console.log('paginatedCategories computed', 'currentPage:', currentPage.value, 'itemsPerPage:', itemsPerPage.value, 'start:', start, 'end:', end, 'paginated size:', paginated.length)
      return paginated
    })

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        // Recarregar categorias quando a página muda
        loadCategories()
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        // Recarregar categorias quando a página muda
        loadCategories()
      }
    }

    // Filtrar produtos
    const filteredProducts = computed(() => {
      return categoryProducts.value
    })

    // Ajustar página atual de produtos quando necessário
    watch(productTotalPages, (newTotalPages) => {
      if (productCurrentPage.value > newTotalPages) {
        productCurrentPage.value = newTotalPages
      }
    })

    const paginatedProducts = computed(() => {
      return categoryProducts.value || []
    })

    const nextProductPage = () => {
      if (productCurrentPage.value < productTotalPages.value) {
        productCurrentPage.value++
        // Recarregar produtos quando a página muda
        if (expandedCategory.value) {
          loadCategoryProducts(expandedCategory.value, false)
        }
      }
    }

    const prevProductPage = () => {
      if (productCurrentPage.value > 1) {
        productCurrentPage.value--
        // Recarregar produtos quando a página muda
        if (expandedCategory.value) {
          loadCategoryProducts(expandedCategory.value, false)
        }
      }
    }

    // Formatar preço
    const formatPrice = (price) => {
      if (!price) return '-'
      return `$${Number(price).toFixed(2)}`
    }

    // Tratamento de erro de imagem
    const handleImageError = (e) => {
      // Usa a função utilitária do imageService para lidar com erros de imagem
      imageService.handleImageError(e)
    }

    // Obter URL da imagem do produto
    const getProductImage = (imagePath, product) => {
      return imageService.getProductImageUrl(imagePath, product)
    }

    // Resetar paginação e recarregar categorias quando os filtros mudam
    watch([showDisabled, showOnlyWithProducts], () => {
      currentPage.value = 1
      loadCategories()
    })

    // Apenas resetar a página quando o termo de busca muda, sem recarregar as categorias
    // (já estamos fazendo isso na função debouncedSearch)
    watch(searchQuery, () => {
      // Não fazer nada aqui, pois já estamos tratando na função debouncedSearch
    })

    // Recarregar categorias quando a página ou itens por página mudam
    watch(itemsPerPage, () => {
      currentPage.value = 1 // Resetar para a primeira página quando o número de itens por página muda
      loadCategories()
    })

    // Recarregar produtos quando o número de itens por página muda
    watch(productItemsPerPage, () => {
      productCurrentPage.value = 1 // Resetar para a primeira página quando o número de itens por página muda
      if (expandedCategory.value) {
        loadCategoryProducts(expandedCategory.value, true)
      }
    })

    // Garantir que as categorias estejam contraídas após o carregamento
    // Descomentar para colapsar automaticamente todas as categorias quando mudam
    watch(categories, (newCategories) => {
      if (newCategories && newCategories.length) {
        // collapseAllCategories(newCategories)
        // console.log('Categorias mudaram, mas não estamos colapsando automaticamente')
      }
    })

    // Carregar dados iniciais
    onMounted(() => {
      loadCategories()
    })

    return {
      // Estado
      categories,
      loading,
      error,
      searchQuery,
      showDisabled,
      showOnlyWithProducts,
      currentPage,
      itemsPerPage,
      totalItems,
      expandedCategory,
      categoryProducts,
      productTotalItems,
      loadingProducts,
      productSearchQuery,
      productCurrentPage,
      productItemsPerPage,

      // Computed
      filteredCategories,
      flattenedCategories,
      paginatedCategories,
      totalPages,
      filteredProducts,
      paginatedProducts,
      productTotalPages,

      // Métodos
      loadCategories,
      loadCategoryProducts,
      expandCategory,
      toggleCategoryExpanded,
      toggleCategoryStatus,
      toggleProductStatus,
      debouncedSearch,
      debouncedProductSearch,
      nextPage,
      prevPage,
      nextProductPage,
      prevProductPage,
      formatPrice,
      handleImageError,
      getProductImage,
      collapseAllCategories
    }
  }
}
</script>

<style scoped>
.font-archivo-narrow {
  font-family: 'Archivo Narrow', sans-serif;
}

.font-archivo {
  font-family: 'Archivo', sans-serif;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-500 {
  transition-duration: 500ms;
}

.bg-yellow-50 {
  background-color: rgba(254, 252, 232, 1);
}
</style>
