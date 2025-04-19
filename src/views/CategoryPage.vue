<template>
  <div class="min-h-screen bg-white">
    <!-- Filtros e Produtos -->
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar com Filtros - Visível apenas em Desktop -->
        <div class="hidden lg:block w-[300px] flex-shrink-0">
          <div class="sticky top-8">
            <div> <!-- Removido border border-[#FAFAFA] -->
              <!-- Filtro de Categorias -->
              <div class="flex flex-col gap-12 w-[328px]">
                <!-- Título do Filtro -->
                <div class="flex flex-col w-full">
                  <div class="flex items-center w-full h-[72.66px] bg-black border-b-[5px] border-b-empire-yellow transform rotate-[0.21deg]">
                    <h3 class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-empire-yellow px-6">
                      {{ $t('categoryPage.categories') }}
                    </h3>
                  </div>
                </div>

                <!-- Lista de Categorias Hierárquica -->
                <div class="mb-12 category-filter-container">
                  <div v-if="loadingCategories" class="flex justify-center items-center py-4">
                    <div class="loader-container">
                      <div class="loader-spinner"></div>
                      <div class="loader-text">{{ $t('common.loading') }}...</div>
                    </div>
                  </div>
                  <CategoryTree
                    v-else
                    :categories="categoryTree"
                    :selected-category="selectedCategory"
                    @select="selectCategory"
                  />
                </div>
              </div>

                <!-- Filtro de Preço (exibido apenas se o toggle master estiver habilitado) -->
                <div v-if="showPrices" class="flex flex-col gap-12 w-[328px] mb-12">
                  <!-- Título do Filtro -->
                  <div class="flex flex-col w-full">
                    <div class="flex items-center w-full h-[72.66px] bg-black border-b-[5px] border-b-empire-yellow transform rotate-[0.21deg]">
                      <h3 class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-empire-yellow px-6">
                        {{ $t('categoryPage.price') }}
                      </h3>
                    </div>
                  </div>

                  <!-- Conteúdo do Filtro -->
                  <div class="px-3">
                    <div class="flex justify-between items-center mb-2">
                      <span class="font-archivo text-sm">
                        {{ currencySymbol }}{{ priceRange[0] }}
                      </span>
                      <span class="font-archivo text-sm">
                        {{ currencySymbol }}{{ priceRange[1] }}
                      </span>
                    </div>
                    <div class="relative w-full h-8">
                      <div class="absolute w-full h-2 bg-[#E6E6E6] rounded-full top-3"></div>
                      <div
                        class="absolute h-2 bg-black rounded-full top-3"
                        :style="{ left: (priceRange[0] / maxPrice) * 100 + '%', right: 100 - (priceRange[1] / maxPrice) * 100 + '%' }"
                      ></div>
                      <input
                        type="range"
                        :min="0"
                        :max="maxPrice"
                        v-model.number="priceRange[0]"
                        class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none"
                        @mousedown="handleRangeStart"
                        @mouseup="handleRangeEnd"
                        @touchstart="handleRangeStart"
                        @touchend="handleRangeEnd"
                      >
                      <input
                        type="range"
                        :min="0"
                        :max="maxPrice"
                        v-model.number="priceRange[1]"
                        class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none"
                        @mousedown="handleRangeStart"
                        @mouseup="handleRangeEnd"
                        @touchstart="handleRangeStart"
                        @touchend="handleRangeEnd"
                      >
                    </div>
                  </div>
                </div>

                <!-- Filtro de Marca -->
                <div class="flex flex-col gap-12 w-[328px] h-[303.69px]"> <!-- Aumentado gap-6 para gap-12 -->
                  <!-- Título do Filtro -->
                  <div class="flex flex-col w-full">
                    <div class="flex items-center w-full h-[72.66px] bg-black border-b-[5px] border-b-empire-yellow transform rotate-[0.21deg]">
                      <h3 class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-empire-yellow px-6">
                        {{ $t('categoryPage.brands') }}
                      </h3>
                    </div>
                  </div>

                  <!-- Conteúdo do Filtro -->
                  <div class="border border-[#FAFAFA] transform rotate-[0.21deg]">
                    <div class="flex flex-col gap-3">
                      <label
                        v-for="brand in brands"
                        :key="brand.id"
                        class="flex items-center px-6 py-1 gap-3 h-[24.09px]"
                      >
                        <input
                          type="checkbox"
                          :value="brand.id"
                          v-model="selectedBrands"
                          class="w-6 h-6 accent-[#FBBD1E]"
                        >
                        <span class="font-archivo text-[16px] leading-[18px] text-black/70">
                          {{ brand.name }}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <!-- Grid de Produtos -->
        <div class="flex-1">
          <!-- Filtros Mobile e Ordenação -->
          <div class="flex justify-between items-center p-3 border-2 border-black w-full h-16 mb-6">
            <div class="flex-1 flex items-center">
              <!-- Botão de Filtro Mobile -->
              <button
                @click="isMobileFiltersExpanded = !isMobileFiltersExpanded"
                class="md:hidden flex items-center justify-center w-[36px] h-[36px] bg-black p-[6px]"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L9 12V18L15 21V12L20 4H4Z"
                    stroke="#FFDD00"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <!-- Texto de resultados - Visível apenas em desktop -->
              <span class="font-inter text-base hidden md:block">
                {{ totalItems === 0
                  ? $t('categoryPage.noResults')
                  : $t('categoryPage.itemsCount', {
                      start: itemRange.start,
                      end: itemRange.end,
                      total: totalItems
                    })
                }}
              </span>
            </div>

            <div class="flex justify-end w-[240px]">
              <div class="relative w-full">
                <select
                  v-model="sortBy"
                  class="w-full h-10 px-4 py-2 bg-white border border-[#D9D9D9] font-inter text-sm appearance-none cursor-pointer"
                  @change="handleSort"
                >
                  <option
                    v-for="option in sortOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ $t(option.label) }}
                  </option>
                </select>
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="#FFDD00">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Seção de Filtros Expansível Mobile -->
          <div
            v-show="isMobileFiltersExpanded"
            class="w-full mb-6 transition-all duration-300"
          >
            <!-- Filtro de Categorias -->
            <div class="mb-6">
              <div class="flex items-center w-full h-[72.66px] bg-black border-b-[5px] border-b-empire-yellow">
                <h3 class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-empire-yellow px-6">
                  {{ $t('categoryPage.categories') }}
                </h3>
              </div>
              <div class="category-filter-container-mobile">
                <div v-if="loadingCategories" class="flex justify-center items-center py-4">
                  <div class="loader-container">
                    <div class="loader-spinner"></div>
                    <div class="loader-text">{{ $t('common.loading') }}...</div>
                  </div>
                </div>
                <CategoryTree
                  v-else
                  :categories="categoryTree"
                  :selected-category="selectedCategory"
                  @select="selectCategory"
                />
              </div>
            </div>

            <!-- Filtro de Preço (exibido apenas se o toggle master estiver habilitado) -->
            <div v-if="showPrices" class="mb-6">
              <div class="flex items-center w-full h-[72.66px] bg-black border-b-[5px] border-b-empire-yellow">
                <h3 class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-empire-yellow px-6">
                  {{ $t('categoryPage.price') }}
                </h3>
              </div>
              <div class="border border-[#FAFAFA] p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-archivo text-sm">
                    {{ currencySymbol }}{{ priceRange[0] }}
                  </span>
                  <span class="font-archivo text-sm">
                    {{ currencySymbol }}{{ priceRange[1] }}
                  </span>
                </div>
                <div class="relative w-full h-8">
                  <div class="absolute w-full h-2 bg-[#E6E6E6] rounded-full top-3"></div>
                  <div
                    class="absolute h-2 bg-black rounded-full top-3"
                    :style="{ left: (priceRange[0] / maxPrice) * 100 + '%', right: 100 - (priceRange[1] / maxPrice) * 100 + '%' }"
                  ></div>
                  <input
                    type="range"
                    :min="0"
                    :max="maxPrice"
                    v-model.number="priceRange[0]"
                    class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none"
                    @mousedown="handleRangeStart"
                    @mouseup="handleRangeEnd"
                    @touchstart="handleRangeStart"
                    @touchend="handleRangeEnd"
                  >
                  <input
                    type="range"
                    :min="0"
                    :max="maxPrice"
                    v-model.number="priceRange[1]"
                    class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none"
                    @mousedown="handleRangeStart"
                    @mouseup="handleRangeEnd"
                    @touchstart="handleRangeStart"
                    @touchend="handleRangeEnd"
                  >
                </div>
              </div>
            </div>

            <!-- Filtro de Marcas -->
            <div class="mb-6">
              <div class="flex items-center w-full h-[72.66px] bg-black border-b-[5px] border-b-empire-yellow">
                <h3 class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-empire-yellow px-6">
                  {{ $t('categoryPage.brands') }}
                </h3>
              </div>
              <div class="border border-[#FAFAFA] p-4">
                <div class="flex flex-col gap-3">
                  <label
                    v-for="brand in brands"
                    :key="brand.id"
                    class="flex items-center gap-3 h-[24.09px]"
                  >
                    <input
                      type="checkbox"
                      :value="brand.id"
                      v-model="selectedBrands"
                      class="w-6 h-6 accent-[#FBBD1E]"
                    >
                    <span class="font-archivo text-[20px] leading-[22px] text-black/70">
                      {{ brand.name }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Grid de Produtos -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-if="loading" class="col-span-full flex justify-center items-center py-12">
              <div class="loader-container">
                <div class="loader-spinner"></div>
                <div class="loader-text">{{ $t('common.loading') }}...</div>
              </div>
            </div>
            <div v-else-if="error" class="col-span-full text-red-500">
              {{ error }}
            </div>
            <template v-else>

              <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="flex flex-col bg-white border border-[#FAFAFA] min-h-[600px] md:h-[700px]"
              >
                <!-- Wrap the clickable area in a div -->
                <div
                  class="flex flex-col flex-grow cursor-pointer"
                  @click="navigateToProduct(product.id)"
                >
                  <img
                    :src="getProductImage(product)"
                    :alt="product.name"
                    class="w-[80%] h-[200px] md:h-[350px] object-contain object-center mx-auto"
                    @error="handleImageError"
                  >
                  <div class="p-4 flex flex-col flex-grow">
                    <h3 class="font-archivo-narrow font-semibold text-[24px] md:text-[28px] leading-[28px] md:leading-[32px] text-black/70 h-[56px] md:h-[64px] line-clamp-2 mb-2">
                      {{ product.name }}
                    </h3>
                    <p class="font-archivo text-base md:text-lg text-black/70 overflow-hidden description-fixed-height">
                      {{ product.description || '&nbsp;'.repeat(3) }}
                    </p>
                    <div class="mt-auto w-full">
                      <!-- Quando showPrices é true, mostra o preço com espaçamento adequado -->
                      <p v-if="showPrices" class="font-archivo-narrow font-semibold text-[24px] md:text-[28px] leading-[28px] md:leading-[32px] mt-3 mb-2">
                        {{ formatPrice(product.price) }}
                      </p>
                      <!-- Quando showPrices é false, adiciona apenas um pequeno espaçamento -->
                      <div v-else class="mt-3"></div>
                      <!-- Wrap the button in a div that stops event propagation -->
                      <div @click.stop>
                        <ProductQuantitySelector
                          @add-to-cart="(quantity) => handleAddToCart(product, quantity)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Paginação -->
          <div class="flex flex-col items-center mt-12 mb-24 w-full gap-4">
            <div class="flex justify-center items-center gap-2 md:gap-4 w-full">
              <!-- Botão Previous -->
              <button
                class="flex items-center justify-center h-10 px-2 md:px-4 gap-1 bg-[#F9F9FB] rounded-lg min-w-[90px] md:min-w-[120px]"
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)"
              >
                <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="font-inter font-medium text-sm md:text-base">{{ $t('categoryPage.previous') }}</span>
              </button>

              <!-- Números das Páginas -->
              <div class="flex gap-1 md:gap-2">
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-sm md:text-base"
                  :class="page === currentPage ? 'bg-black text-white' : 'bg-[#F9F9FB] text-black'"
                  @click="handlePageChange(page)"
                >
                  {{ page }}
                </button>
              </div>

              <!-- Botão Next -->
              <button
                class="flex items-center justify-center h-10 px-2 md:px-4 gap-1 bg-[#F9F9FB] rounded-lg min-w-[90px] md:min-w-[120px]"
                :disabled="currentPage === totalPages"
                @click="handlePageChange(currentPage + 1)"
              >
                <span class="font-inter font-medium text-sm md:text-base">{{ $t('categoryPage.next') }}</span>
                <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <!-- Contador de Items na paginação -->
            <div class="flex justify-center">
              <span class="font-inter text-sm md:text-base">
                {{ totalItems === 0
                  ? $t('categoryPage.noResults')
                  : $t('categoryPage.itemsCount', {
                      start: itemRange.start,
                      end: itemRange.end,
                      total: totalItems
                    })
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Filtros Mobile -->
    <div
      v-if="showMobileFilters"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
      @click="showMobileFilters = false"
    >
      <div
        class="absolute right-0 top-0 bottom-0 w-[300px] bg-white p-6 overflow-y-auto"
        @click.stop
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">{{ $t('categoryPage.filters') }}</h2>
          <button
            @click="showMobileFilters = false"
            class="p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Conteúdo dos Filtros Mobile -->
        <div class="space-y-8">
          <!-- Filtro de Preço (visível apenas quando showPrices é true) -->
          <div v-if="showPrices">
            <h3 class="font-archivo-narrow font-semibold text-2xl mb-4">{{ $t('categoryPage.priceRange') }}</h3>
            <div class="space-y-2">
              <!-- Slider de preço usando input range nativo -->
              <div class="px-2 py-4">
                <div class="mb-4 flex justify-between">
                  <span class="font-archivo text-sm">{{ showPrices ? `${currencySymbol}${priceRange[0]}` : '' }}</span>
                  <span class="font-archivo text-sm">{{ showPrices ? `${currencySymbol}${priceRange[1]}` : '' }}</span>
                </div>
                <div class="relative h-8 mt-4 mb-6">
                  <input
                    type="range"
                    :min="0"
                    :max="maxPrice"
                    :value="priceRange[1]"
                    @input="updateMaxPriceSlider"
                    @change="handlePriceRangeChange"
                    class="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style="z-index: 1;"
                  />
                  <input
                    type="range"
                    :min="0"
                    :max="maxPrice"
                    :value="priceRange[0]"
                    @input="updateMinPrice"
                    @change="handlePriceRangeChange"
                    class="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style="z-index: 2;"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Filtro de Marca -->
          <div>
            <h3 class="font-archivo-narrow font-semibold text-2xl mb-4">{{ $t('categoryPage.brand') }}</h3>
            <div class="space-y-2">
              <label v-for="brand in brands" :key="brand.id" class="flex items-center gap-2">
                <input
                  type="checkbox"
                  :value="brand.id"
                  v-model="selectedBrands"
                  class="w-5 h-5"
                >
                <span class="font-archivo text-lg">{{ brand.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Message -->
  <div
    v-if="showToast"
    class="fixed bottom-4 right-4 bg-black text-empire-yellow px-6 py-4 rounded-md shadow-lg z-50 transition-opacity duration-300"
    :class="{ 'opacity-0': !showToast, 'opacity-100': showToast }"
  >
    <p class="font-archivo-narrow text-lg">
      {{ $t('cart.productAdded') }}
    </p>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { settingsService } from '@/services/settingsService'
import { imageService } from '@/services/imageService'
import ProductQuantitySelector from '@/components/product/ProductQuantitySelector.vue'
import CategoryTree from '@/components/category/CategoryTree.vue'
import { PLACEHOLDER_IMAGE_PATH } from '@/services/imageConstants'
import { debounce } from 'lodash'
import { useCartStore } from '@/stores/cartStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { useI18n } from 'vue-i18n'
import { productCharacteristicsService } from '@/services/productCharacteristicsService'
// Removendo importação do VueSlider que não está instalado

const route = useRoute()
const router = useRouter()
const { locale } = useI18n() // Adicionando aqui no topo com os outros composables

// Removendo registro do componente VueSlider
const currentPage = ref(1)
const totalPages = ref(1)
const products = ref([])
const loading = ref(true)
const loadingCategories = ref(true)
const error = ref(null)
// Não precisamos mais da variável categories, pois estamos usando diretamente categoryTree
const categoryTree = ref([])
const selectedCategory = ref(null)
const selectedBrands = ref([])
const brands = ref([])
const showMobileFilters = ref(false)
const isMobileFiltersExpanded = ref(false)
const priceRange = ref([0, 3000])
const maxPrice = ref(3000)
const totalItems = ref(0)
const itemsPerPage = ref(9)
const sortBy = ref('featured')
const isDragging = ref(false)
const tempPriceRange = ref([0, 1000])
const cartStore = useCartStore()
const togglesStore = useFinancialTogglesStore()
const showToast = ref(false)
const currencySymbol = ref('$')
const showPrices = ref(true) // Controla a visibilidade dos preços

// Watch para atualizar descrições quando mudar o idioma
watch(locale, (newLocale) => {
  if (products.value.length) {
    products.value = products.value.map(product => ({
      ...product,
      description: product[`description_${newLocale}`] || product.description_en || ''
    }))
  }
})

// Watch para atualizar o valor de sortBy quando o estado do toggle master mudar
watch(showPrices, (newValue) => {
  // Se o toggle master for desabilitado e a ordenação atual for por preço,
  // muda para a ordenação padrão (featured)
  if (!newValue && (sortBy.value === 'priceLowHigh' || sortBy.value === 'priceHighLow')) {
    sortBy.value = 'featured'
    fetchFilteredProducts()
  }
})

// Função para carregar as configurações financeiras
const loadFinancialSettings = async () => {
  try {
    const settings = await settingsService.getFinancialSettings()
    currencySymbol.value = settings.currency_symbol

    // Load toggles state
    togglesStore.loadTogglesFromBackend({
      currency_code_enabled: settings.currency_code_enabled,
      currency_symbol_enabled: settings.currency_symbol_enabled,
      tax_rate_enabled: settings.tax_rate_enabled,
      discount_percentage_enabled: settings.discount_percentage_enabled,
      min_order_value_enabled: settings.min_order_value_enabled,
      free_shipping_threshold_enabled: settings.free_shipping_threshold_enabled,
      shipping_cost_enabled: settings.shipping_cost_enabled,
      master_toggle_enabled: settings.master_toggle_enabled
    })

    // Update price visibility based on master toggle
    showPrices.value = togglesStore.masterToggle
  } catch (error) {
    // Handle error loading financial settings
  }
}

const fetchFilteredProducts = async () => {
  try {
    loading.value = true

    // Prepara os parâmetros de filtro
    const filterParams = {
      categoryId: selectedCategory.value,
      brands: selectedBrands.value,
      page: currentPage.value,
      limit: itemsPerPage.value,
      sortBy: sortBy.value
    }

    // Adiciona os parâmetros de preço apenas se o toggle master estiver habilitado
    if (showPrices.value) {
      filterParams.minPrice = priceRange.value[0]
      filterParams.maxPrice = priceRange.value[1]
    }

    const [productsResponse, settings] = await Promise.all([
      productService.getProducts(filterParams),
      settingsService.getFinancialSettings()
    ])

    products.value = productsResponse.items.map(product => ({
      ...product,
      description: product[`description_${locale.value}`] || product.description_en || ''
    }))

    totalItems.value = productsResponse.total
    totalPages.value = Math.ceil(productsResponse.total / itemsPerPage.value)
    currencySymbol.value = settings.currency_symbol

  } catch (err) {
    error.value = 'Error loading products'
    products.value = []
  } finally {
    loading.value = false
  }
}

const handleSort = () => {
  currentPage.value = 1 // Reset para primeira página ao mudar ordenação
  fetchFilteredProducts()
}

const handlePriceRangeChange = () => {
  currentPage.value = 1 // Reset para primeira página ao mudar o intervalo de preço
  fetchFilteredProducts()
}

// Atualiza o valor mínimo do intervalo de preço
const updateMinPrice = (event) => {
  const minValue = parseInt(event.target.value)
  const maxValue = priceRange.value[1]

  // Garante que o valor mínimo não ultrapasse o valor máximo
  if (minValue < maxValue) {
    priceRange.value = [minValue, maxValue]
  } else {
    // Se o valor mínimo for maior que o máximo, define o valor mínimo como o máximo - 1
    priceRange.value = [maxValue - 1, maxValue]
    event.target.value = maxValue - 1
  }
}

// Atualiza o valor máximo do intervalo de preço
const updateMaxPriceSlider = (event) => {
  const maxValue = parseInt(event.target.value)
  const minValue = priceRange.value[0]

  // Garante que o valor máximo não seja menor que o valor mínimo
  if (maxValue > minValue) {
    priceRange.value = [minValue, maxValue]
  } else {
    // Se o valor máximo for menor que o mínimo, define o valor máximo como o mínimo + 1
    priceRange.value = [minValue, minValue + 1]
    event.target.value = minValue + 1
  }
}

// Computed property para filteredProducts
const filteredProducts = computed(() => products.value)

// Computed para opções de ordenação disponíveis
const sortOptions = computed(() => {
  const options = [
    { value: 'featured', label: 'categoryPage.sortBy.featured' },
    { value: 'nameAZ', label: 'categoryPage.sortBy.nameAZ' },
    { value: 'nameZA', label: 'categoryPage.sortBy.nameZA' }
  ]

  // Adiciona opções de ordenação por preço apenas se o toggle master estiver habilitado
  if (showPrices.value) {
    options.splice(1, 0,
      { value: 'priceLowHigh', label: 'categoryPage.sortBy.priceLowHigh' },
      { value: 'priceHighLow', label: 'categoryPage.sortBy.priceHighLow' }
    )
  }

  return options
})

// Computed para páginas a serem exibidas
const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Computed property para calcular o intervalo de itens
const itemRange = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(start + itemsPerPage.value - 1, totalItems.value)
  return { start, end }
})

// Watch to react to filter changes
watch([selectedBrands, selectedCategory], async () => {
  currentPage.value = 1;

  // If there is a selected category, update the maximum price
  if (selectedCategory.value) {
    await updateMaxPrice();
  }

  await fetchFilteredProducts();
}, { deep: true })

const fetchCategories = async () => {
  try {
    loadingCategories.value = true
    // Buscar categorias diretamente do backend com estrutura hierárquica
    // e apenas categorias ativas com produtos
    const hierarchicalCategories = await categoryService.searchCategories('', true)

    // Garantir que todas as categorias estejam contraídas por padrão
    const setAllCollapsed = (tree) => {
      tree.forEach(category => {
        // Define a categoria como contraída
        category.expanded = false

        // Processa recursivamente os filhos
        if (category.children && category.children.length > 0) {
          setAllCollapsed(category.children)
        }
      })
    }

    // Aplicar a contração a todas as categorias
    setAllCollapsed(hierarchicalCategories)

    // Usar as categorias hierárquicas com todas contraídas
    categoryTree.value = hierarchicalCategories



    // Removido log desnecessário sobre categorias raiz
  } catch (err) {
    error.value = 'Error loading categories'
    categoryTree.value = []
  } finally {
    loadingCategories.value = false
  }
}

const fetchBrands = async (categoryId = null) => {
  try {
    let response;
    if (categoryId) {
      response = await productService.getBrandsByCategory(categoryId)
    } else {
      response = await productService.getBrands()
    }
    brands.value = response || []

  } catch (err) {
    error.value = 'Error loading brands'
    brands.value = []
  }
}

// Função para atualizar o preço máximo com base na categoria selecionada
const updateMaxPrice = async () => {
  // If the master toggle is disabled, don't update the maximum price
  if (!showPrices.value) {
    return;
  }

  try {
    // Busca o preço máximo dos produtos da categoria selecionada
    const categoryMaxPrice = await productService.getMaxPrice(selectedCategory.value, selectedBrands.value);

    // Round to the next thousand
    // For example, if the maximum price is 2345, round to 3000
    const roundedMaxPrice = Math.ceil(categoryMaxPrice / 1000) * 1000;

    // Set the maximum value of the price filter
    // Ensuring that the minimum value is 3000 to cover products with prices greater than 1000
    maxPrice.value = Math.max(roundedMaxPrice, 3000);

    // Update the price range to use the new maximum value
    priceRange.value = [0, maxPrice.value];
  } catch (err) {
    // In case of error, set a higher default value
    maxPrice.value = 3000;
    priceRange.value = [0, 3000];
  }
}

const getProductImage = (product) => {
  const imageUrl = imageService.getProductImageUrl(product.image, product);
  return imageUrl;
}

const handleImageError = (e) => {
  e.target.src = PLACEHOLDER_IMAGE_PATH
  e.target.onerror = null // Previne loop infinito
}

const selectCategory = async (categoryId) => {
  // If a category is already selected and it's the same as the one being clicked, do nothing
  if (selectedCategory.value === categoryId) {
    return; // Don't allow deselecting the category
  }

  // Activate loading only for the product list
  loading.value = true;

  try {
    // Reset the current page when changing category
    currentPage.value = 1;

    // Set the new selected category
    selectedCategory.value = categoryId;

    // Get brands related to the selected category
    await fetchBrands(selectedCategory.value);
    selectedBrands.value = brands.value.map(brand => brand.id);

    // Update the maximum price based on the selected category
    await updateMaxPrice();

    // Update the URL without reloading the page
    const newPath = `/categories/${categoryId}`;
    if (window.history.pushState) {
      window.history.pushState({ path: newPath }, '', newPath);
    }

    // Get filtered products explicitly
    await fetchFilteredProducts();

    // Scroll to the sorting part to ensure it's visible
    setTimeout(() => {
      const sortingElement = document.querySelector('.flex.justify-between.items-center.p-3.border-2.border-black')
      if (sortingElement) {
        const yOffset = -20 // Adjustment to ensure the sorting part is visible
        const y = sortingElement.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 100); // Small delay to ensure the DOM has been updated
  } catch (error) {
    // Handle error selecting category
  } finally {
    // Deactivate loading
    loading.value = false;
  }
}

const handleAddToCart = (product, quantity) => {
  // Check if the product has characteristics that need to be selected
  if (productCharacteristicsService.hasCharacteristics(product)) {
    // If it has characteristics, redirect to the product details page
    router.push({
      path: `/product/${product.id}`,
      query: { showValidation: 'true' } // Pass a parameter to show validation
    });
    return;
  }

  // If it doesn't have characteristics, add directly to cart
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity,
    image: getProductImage(product),
    foxpro_code: product.foxpro_code
  }

  cartStore.addItem(cartItem)
  showSuccessToast()
}

const showSuccessToast = () => {
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const handlePageChange = async (page) => {
  // Activate loading only for the product list
  loading.value = true

  try {
    currentPage.value = page
    await fetchFilteredProducts()

    // Scroll to the sorting part to ensure it's visible
    setTimeout(() => {
      const sortingElement = document.querySelector('.flex.justify-between.items-center.p-3.border-2.border-black')
      if (sortingElement) {
        const yOffset = -20 // Adjustment to ensure the sorting part is visible
        const y = sortingElement.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      } else {
        // Fallback to previous behavior
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100) // Small delay to ensure the DOM has been updated
  } catch (error) {
    // Handle error changing page
  } finally {
    // Deactivate loading
    loading.value = false
  }
}

// Function to select the first category
const selectFirstCategory = () => {
  // Check if there are available categories
  if (categoryTree.value && categoryTree.value.length > 0) {
    selectCategory(categoryTree.value[0].id)

    // Scroll to the selected category
    scrollToCategoryItem(categoryTree.value[0].id)
  } else {
    // Try to fetch categories again
    fetchCategories().then(() => {
      if (categoryTree.value && categoryTree.value.length > 0) {
        selectCategory(categoryTree.value[0].id)

        // Scroll to the selected category
        scrollToCategoryItem(categoryTree.value[0].id)
      }
    })
  }
}

// Function to select category by slug
// Function to scroll to the selected item in the category filter
const scrollToCategoryItem = (categoryId) => {
  // Increased delay to ensure the DOM has been completely updated
  setTimeout(() => {
    try {
      // Find all elements that may contain the category ID
      const categoryElements = document.querySelectorAll(`[data-category-id="${categoryId}"]`)

      // Find the most specific element (the category header)
      let selectedElement = null
      categoryElements.forEach(el => {
        if (el.classList.contains('category-header') || el.querySelector('.category-header')) {
          selectedElement = el
        }
      })

      // If the header was not found, use the first element found
      if (!selectedElement && categoryElements.length > 0) {
        selectedElement = categoryElements[0]
      }

      if (selectedElement) {
        // Find the category filter container (desktop and mobile)
        const desktopContainer = document.querySelector('.category-filter-container')
        const mobileContainer = document.querySelector('.category-filter-container-mobile')

        // Determine which container is visible
        const container = window.innerWidth >= 1024 ? desktopContainer : mobileContainer

        if (container) {
          // Force the container to be scrollable
          container.style.overflowY = 'auto'

          // Use scrollIntoView to scroll to the element
          selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    } catch (error) {
      // Handle error scrolling to category
    }
  }, 500) // Increased delay to 500ms to ensure the DOM has been completely updated
}

const selectCategoryBySlug = async (slug) => {
  // Wait for categories to load if they are not loaded yet
  if (loadingCategories.value) {
    await new Promise(resolve => {
      const checkLoading = setInterval(() => {
        if (!loadingCategories.value) {
          clearInterval(checkLoading)
          resolve()
        }
      }, 100)
    })
  }

  // Check if we have loaded categories
  if (categoryTree.value && categoryTree.value.length > 0) {
    // Function to find the path to the category
    const findPathToCategory = (tree, id, path = []) => {
      for (const node of tree) {
        // Try with the current node
        const currentPath = [...path, node]
        if (node.id === id) {
          return currentPath
        }
        // Try with the children
        if (node.children && node.children.length > 0) {
          const foundPath = findPathToCategory(node.children, id, currentPath)
          if (foundPath) return foundPath
        }
      }
      return null
    }

    // Find the path to the category
    const categoryPath = findPathToCategory(categoryTree.value, slug)

    if (categoryPath) {
      // Expand all categories in the path
      categoryPath.forEach(cat => {
        cat.expanded = true
      })

      // Update the category tree to reflect the expansions
      categoryTree.value = [...categoryTree.value]

      // Select the category
      await selectCategory(slug)

      // Scroll to the selected item
      scrollToCategoryItem(slug)

      return
    }
  }

  // If we got here, try to get the category directly from the backend
  try {
    // Get categories with the hierarchical structure including the specified category
    await fetchCategories()

    // Try again to find the category in the updated tree
    return selectCategoryBySlug(slug)
  } catch (error) {
    // Handle error fetching category from backend
  }

  // If we got here, select the first category as fallback
  selectFirstCategory()
}

onMounted(async () => {
  try {
    await loadFinancialSettings()
    await fetchCategories()

    // Check if the route has a category ID
    if (route.params.slug) {
      // Select the category specified in the route and expand its parents
      await selectCategoryBySlug(route.params.slug)
    } else {
      // If there is no ID in the route, select the first category
      selectFirstCategory()
    }

    await fetchFilteredProducts()
  } catch (err) {
    error.value = 'Error loading page'
  }
})

// Observar mudanças na rota para atualizar a categoria selecionada
watch(
  () => route.params.slug,
  async (newSlug) => {
    console.log('ID de categoria na rota alterado para:', newSlug)

    // Garante que as categorias estejam carregadas
    if (loadingCategories.value) {
      await new Promise(resolve => {
        const checkLoading = setInterval(() => {
          if (!loadingCategories.value) {
            clearInterval(checkLoading)
            resolve()
          }
        }, 100)
      })
    }

    // Redefine todas as categorias como contraídas
    const resetAllExpanded = (tree) => {
      tree.forEach(category => {
        category.expanded = false
        if (category.children && category.children.length > 0) {
          resetAllExpanded(category.children)
        }
      })
    }
    resetAllExpanded(categoryTree.value)

    // Atualiza a árvore para refletir as mudanças
    categoryTree.value = [...categoryTree.value]

    if (newSlug) {
      // Se houver um ID na rota, seleciona a categoria e expande seus pais
      await selectCategoryBySlug(newSlug)
    } else {
      console.log('ID de categoria removido da rota, selecionando a primeira categoria')
      selectFirstCategory()
    }

    // Força a busca de produtos após a mudança de categoria
    await fetchFilteredProducts()
  }
)

// Função debounced que só será chamada quando o usuário terminar de arrastar
const debouncedFetchProducts = debounce(() => {
  console.log('🎯 Valores atuais:', {
    isDragging: isDragging.value,
    tempRange: tempPriceRange.value,
    currentRange: priceRange.value
  })

  // Se NÃO está arrastando E os valores são diferentes, faz a requisição
  if (!isDragging.value &&
      (tempPriceRange.value[0] !== priceRange.value[0] ||
       tempPriceRange.value[1] !== priceRange.value[1])) {
    console.log('🔄 Fazendo requisição após debounce')
    currentPage.value = 1
    fetchFilteredProducts()
    tempPriceRange.value = [...priceRange.value]
  } else {
    console.log('❌ Requisição ignorada porque:',
      isDragging.value ? 'ainda está arrastando' : 'valores não mudaram')
  }
}, 500)

const handleRangeStart = () => {
  isDragging.value = true
  console.log('🟢 isDragging:', isDragging.value, '- Início do arrasto')
  tempPriceRange.value = [...priceRange.value]
}

const handleRangeEnd = () => {
  isDragging.value = false
  console.log('🔴 isDragging:', isDragging.value, '- Fim do arrasto')
  if (tempPriceRange.value[0] !== priceRange.value[0] ||
      tempPriceRange.value[1] !== priceRange.value[1]) {
    debouncedFetchProducts()
  }
}

// Watch apenas para quando isDragging mudar para false
watch(isDragging, (newValue) => {
  console.log('👀 Watch isDragging:', newValue, {
    tempRange: tempPriceRange.value,
    currentRange: priceRange.value
  })

  if (!newValue &&
      (tempPriceRange.value[0] !== priceRange.value[0] ||
       tempPriceRange.value[1] !== priceRange.value[1])) {
    debouncedFetchProducts()
  }
})

const navigateToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const formatPrice = (price) => {
  return `${currencySymbol.value}${Number(price).toFixed(2)}`
}

</script>

<script>
/* eslint-disable vue/no-dupe-keys */
export default {
  name: 'CategoryPage',
  components: {
    ProductQuantitySelector
  },
  data() {
    return {
      showMobileFilters: false,
      selectedBrands: [],
      priceRange: [0, 1000],
      maxPrice: 1000,
      selectedCategory: null
    }
  },
  methods: {
    handleImageError(e) {
      e.target.src = PLACEHOLDER_IMAGE_PATH
      e.target.onerror = null
    },
    addToCart(product, quantity) {
      console.log('Adding to cart:', product, 'quantity:', quantity)
    },
    selectCategory(categoryId) {
      // Se já tiver uma categoria selecionada e for a mesma que está sendo clicada, não faz nada
      if (this.selectedCategory === categoryId) {
        return; // Não permite desmarcar a categoria
      }

      // Define a nova categoria selecionada
      this.selectedCategory = categoryId;
    }
  }
}
</script>
<style scoped>
input[type="range"]::-webkit-slider-thumb {
  pointer-events: auto;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #2C2C2C;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  pointer-events: auto;
  width: 16px;
  height: 16px;
  background: #2C2C2C;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* Estilização personalizada para os checkboxes */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.7);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #FBBD1E;
  border-color: #FBBD1E;
}

input[type="checkbox"]:checked::after {
  content: '';
  width: 12px;
  height: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.selected-category {
  background-color: rgba(251, 189, 30, 0.1); /* Cor amarela com transparência */
}

.selected-category:hover {
  background-color: rgba(251, 189, 30, 0.2); /* Cor amarela um pouco mais escura no hover */
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader-spinner {
  border: 4px solid rgba(251, 189, 30, 0.3);
  border-top: 4px solid #FBBD1E;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loader-text {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.aspect-square {
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

@media (max-width: 768px) {
  .aspect-square {
    aspect-ratio: 1 / 0.75; /* Proporção um pouco menor para mobile */
  }
}

/* Removendo o ícone padrão do select no Chrome/Safari */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Removendo o ícone padrão do select no IE/Edge */
select::-ms-expand {
  display: none;
}

/* Garantindo que o select fique por cima do ícone customizado */
select {
  position: relative;
  z-index: 1;
  background-color: transparent;
}

/* Estilo para o hover do select */
select:hover {
  border-color: #FFDD00;
}

/* Estilo para o focus do select */
select:focus {
  outline: none;
  border-color: #FFDD00;
  box-shadow: 0 0 0 2px rgba(255, 221, 0, 0.2);
}

/* Adicione estes estilos para melhorar a interação */
.cursor-pointer:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Estilos para os sliders de preço */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 5px;
  background: #E0E0E0; /* Voltando para o cinza claro original */
  border-radius: 5px;
  background-image: linear-gradient(#F9C349, #F9C349);
  background-repeat: no-repeat;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 22px;
  width: 22px;
  border-radius: 50%;
  background: #F9C349; /* Alterado de white para #F9C349 */
  border: 2px solid #F9C349;
  cursor: pointer;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
  transition: all 0.2s ease;
  position: relative;
  z-index: 10; /* Garantindo que o círculo fique visível */
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.4);
}

input[type="range"]::-moz-range-thumb {
  height: 22px;
  width: 22px;
  border-radius: 50%;
  background: #F9C349; /* Alterado de white para #F9C349 */
  border: 2px solid #F9C349;
  cursor: pointer;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
  transition: all 0.2s ease;
  position: relative;
  z-index: 10; /* Garantindo que o círculo fique visível */
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.4);
}

input[type="range"]::-ms-thumb {
  height: 22px;
  width: 22px;
  border-radius: 50%;
  background: #F9C349; /* Alterado de white para #F9C349 */
  border: 2px solid #F9C349;
  cursor: pointer;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);
  transition: all 0.2s ease;
  position: relative;
  z-index: 10; /* Garantindo que o círculo fique visível */
}

input[type="range"]::-ms-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.4);
}

input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: #E0E0E0; /* Voltando para o cinza claro original */
}

input[type="range"]::-moz-range-track {
  box-shadow: none;
  border: none;
  background: #E0E0E0; /* Voltando para o cinza claro original */
}

input[type="range"]::-ms-track {
  box-shadow: none;
  border: none;
  background: #E0E0E0; /* Voltando para o cinza claro original */
}

/* Estilo para o segundo slider (valor máximo) */
input[type="range"]:nth-child(2) {
  background: none;
}

/* Estilo personalizado para o espaçamento automático */
.mt-auto {
  margin-top: 10%;
}

/* Estilo para manter a altura fixa da descrição */
.description-fixed-height {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  height: 4.5em; /* Altura fixa para 3 linhas */
  min-height: 4.5em;
  line-height: 1.5em;
}

/* Removendo os estilos da linha cinza escuro */

/* Estilos para o contêiner de filtro de categorias */
.category-filter-container {
  background: linear-gradient(145deg, #ffffff, #f8f8f8);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(251, 189, 30, 0.1);
  position: relative;
  overflow-y: auto;
  max-height: 70vh; /* Altura máxima para garantir que a barra de rolagem apareça quando necessário */
  scrollbar-width: thin; /* Para Firefox */
  scrollbar-color: #FBBD1E #f1f1f1; /* Para Firefox */
  scroll-behavior: smooth; /* Rolagem suave */
}

/* Estilização da barra de rolagem para WebKit (Chrome, Safari, etc.) */
.category-filter-container::-webkit-scrollbar {
  width: 6px;
}

.category-filter-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.category-filter-container::-webkit-scrollbar-thumb {
  background: #FBBD1E;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.category-filter-container::-webkit-scrollbar-thumb:hover {
  background: #e0a800;
}

.category-filter-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #FBBD1E, rgba(251, 189, 30, 0.3));
  border-radius: 4px 0 0 4px;
}

.category-filter-container-mobile {
  background: linear-gradient(145deg, #ffffff, #f8f8f8);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(251, 189, 30, 0.1);
  position: relative;
  overflow-y: auto;
  max-height: 50vh; /* Altura máxima menor para mobile */
  margin-bottom: 1rem;
  scrollbar-width: thin; /* Para Firefox */
  scrollbar-color: #FBBD1E #f1f1f1; /* Para Firefox */
  scroll-behavior: smooth; /* Rolagem suave */
}

/* Estilização da barra de rolagem para WebKit (Chrome, Safari, etc.) */
.category-filter-container-mobile::-webkit-scrollbar {
  width: 6px;
}

.category-filter-container-mobile::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.category-filter-container-mobile::-webkit-scrollbar-thumb {
  background: #FBBD1E;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.category-filter-container-mobile::-webkit-scrollbar-thumb:hover {
  background: #e0a800;
}

.category-filter-container-mobile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #FBBD1E, rgba(251, 189, 30, 0.3));
  border-radius: 4px 0 0 4px;
}
</style>
























