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
              <div class="flex flex-col gap-6 w-[328px]">
                <!-- Título do Filtro -->
                <div class="flex flex-col w-full">
                  <div class="flex items-center w-full h-[72.66px] bg-black border-b-[5px] border-b-empire-yellow transform rotate-[0.21deg]">
                    <h3 class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-empire-yellow px-6">
                      {{ $t('categoryPage.categories') }}
                    </h3>
                  </div>
                </div>



                <!-- Lista de Categorias Hierárquica -->
                <div class="mb-6 category-filter-container">
                  <div v-if="loading" class="flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-empire-yellow"></div>
                  </div>
                  <div v-else-if="categoryTree.length === 0" class="p-4 text-center text-gray-500">
                    {{ $t('categoryPage.noCategories') }}
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
            <div class="mb-3">
              <div class="flex items-center w-full h-[72.66px] bg-black border-b-[5px] border-b-empire-yellow">
                <h3 class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-empire-yellow px-6">
                  {{ $t('categoryPage.categories') }}
                </h3>
              </div>
              <div class="category-filter-container-mobile mt-[-0.25rem]">
                <!-- Conteúdo do filtro de categorias hierárquico -->
                <CategoryTree
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
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-empire-yellow"></div>
            </div>
            <div v-else-if="error" class="col-span-full text-red-500">
              {{ error }}
            </div>
            <template v-else>

              <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="flex flex-col bg-white border border-[#FAFAFA]"
                :class="{
                  'min-h-[500px] md:h-[700px]': showPrices,
                  'min-h-[450px] md:h-[650px]': !showPrices
                }"
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
                  <div class="p-4 pb-0 md:pb-4 flex flex-col flex-grow">
                    <h3 class="font-archivo-narrow font-semibold text-[24px] md:text-[28px] leading-[28px] md:leading-[32px] text-black/70 h-[56px] md:h-[64px] line-clamp-2 mb-2">
                      {{ product.name }}
                    </h3>
                    <p class="font-archivo text-base md:text-lg text-black/70 mb-2 md:mb-4 overflow-hidden"
                       :class="{
                         'line-clamp-5 md:line-clamp-2': showPrices,
                         'line-clamp-6 md:line-clamp-3': !showPrices
                       }">
                      {{ product.description }}
                    </p>
                    <div class="mt-0 w-full">
                      <!-- Área de preço - só exibida quando os preços estão habilitados -->
                      <p v-if="showPrices" class="font-archivo-narrow font-semibold text-[24px] md:text-[28px] leading-[28px] md:leading-[32px] mb-2 md:mb-4">
                        {{ formatPrice(product.price) }}
                      </p>
                      <!-- Wrap the button in a div that stops event propagation -->
                      <div @click.stop class="-mb-8 md:mb-0">
                        <!-- Não adiciona margem superior quando não há preço na versão mobile -->
                        <ProductQuantitySelector
                          @add-to-cart="(quantity) => handleAddToCart(product, quantity)"
                          class="text-responsive-add-cart"
                          :class="{ 'md:mt-4': !showPrices }"
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
const { locale, t } = useI18n() // Adicionando aqui no topo com os outros composables

// Removendo registro do componente VueSlider
const currentPage = ref(1)
const totalPages = ref(1)
const products = ref([])
const loading = ref(true)
const error = ref(null)
const categories = ref([])
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
// Removidas variáveis e funções relacionadas à busca de categorias

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
    console.log('🔧 Financial Settings loaded:', settings)
    currencySymbol.value = settings.currency_symbol
    console.log('💱 Currency Symbol set to:', currencySymbol.value)

    // Carrega o estado dos toggles
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

    // Atualiza a visibilidade dos preços com base no toggle master
    showPrices.value = togglesStore.masterToggle
    console.log('Master toggle state:', togglesStore.masterToggle)
    console.log('Show prices:', showPrices.value)
  } catch (error) {
    console.error('Error loading financial settings:', error)
  }
}

const fetchFilteredProducts = async () => {
  console.log(`[CategoryPage] Iniciando fetchFilteredProducts`);
  console.log(`[CategoryPage] Categoria selecionada: ${selectedCategory.value}`);

  try {
    // Mostrar indicador de carregamento apenas para a lista de produtos
    const productsGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6');
    if (productsGrid) {
      // Adiciona um overlay de carregamento apenas na lista de produtos
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10';
      loadingOverlay.id = 'products-loading-overlay';
      loadingOverlay.innerHTML = '<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-empire-yellow"></div>';

      // Adiciona posicionamento relativo ao grid de produtos se ainda não tiver
      if (window.getComputedStyle(productsGrid).position === 'static') {
        productsGrid.style.position = 'relative';
      }

      // Remove qualquer overlay existente antes de adicionar um novo
      const existingOverlay = document.getElementById('products-loading-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }

      productsGrid.appendChild(loadingOverlay);
    } else {
      // Fallback para o indicador de carregamento global se não encontrar o grid de produtos
      loading.value = true;
    }
    console.log(`[CategoryPage] Indicador de carregamento ativado em fetchFilteredProducts`);

    // Prepara os parâmetros de filtro
    const filterParams = {
      categoryId: selectedCategory.value,
      brands: selectedBrands.value,
      page: currentPage.value,
      limit: itemsPerPage.value,
      sortBy: sortBy.value
    }

    console.log(`[CategoryPage] Parâmetros de filtro:`, filterParams);

    // Adiciona os parâmetros de preço apenas se o toggle master estiver habilitado
    if (showPrices.value) {
      filterParams.minPrice = priceRange.value[0]
      filterParams.maxPrice = priceRange.value[1]
    }

    console.log('Buscando produtos com os seguintes filtros:', filterParams)

    const [productsResponse, settings] = await Promise.all([
      productService.getProducts(filterParams),
      settingsService.getFinancialSettings()
    ])

    console.log('[CategoryPage] Resposta da API de produtos:', productsResponse)
    console.log(`[CategoryPage] Total de produtos retornados: ${productsResponse.items?.length || 0}`)
    console.log(`[CategoryPage] Total de produtos na resposta: ${productsResponse.total}`)

    if (!productsResponse.items || productsResponse.items.length === 0) {
      console.log('[CategoryPage] Nenhum produto retornado pela API')
      products.value = []
    } else {
      products.value = productsResponse.items.map(product => ({
        ...product,
        description: product[`description_${locale.value}`] || product.description_en || ''
      }))
      console.log(`[CategoryPage] ${products.value.length} produtos processados e armazenados`)
    }

    totalItems.value = productsResponse.total
    totalPages.value = Math.ceil(productsResponse.total / itemsPerPage.value)
    currencySymbol.value = settings.currency_symbol

    console.log(`[CategoryPage] Atualizado totalItems: ${totalItems.value}, totalPages: ${totalPages.value}`)

  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Error loading products'
    products.value = []
  } finally {
    loading.value = false

    // Remover o overlay de carregamento da lista de produtos
    const loadingOverlay = document.getElementById('products-loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.remove();
      console.log('[CategoryPage] Overlay de carregamento removido em fetchFilteredProducts');
    }
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

// Watched para reagir às mudanças nos filtros
watch([selectedBrands, selectedCategory], async () => {
  console.log('Filtros alterados:', {
    selectedBrands: selectedBrands.value,
    selectedCategory: selectedCategory.value
  });

  currentPage.value = 1;

  // Se houver uma categoria selecionada, atualiza o preço máximo
  if (selectedCategory.value) {
    console.log('Atualizando preço máximo para a categoria:', selectedCategory.value);
    await updateMaxPrice();
  }

  console.log('Buscando produtos após mudança nos filtros');
  await fetchFilteredProducts();
}, { deep: true })

const fetchCategories = async () => {
  try {
    loading.value = true
    console.log(`[CategoryPage] Iniciando busca de categorias`)

    // Buscar apenas categorias com produtos, como no menu loja do header
    const hierarchicalCategories = await categoryService.searchCategories('', true)
    console.log(`[CategoryPage] Recebidas ${hierarchicalCategories.length} categorias raiz do backend com estrutura hierárquica`)

    // Armazenar todas as categorias para uso posterior
    categories.value = hierarchicalCategories

    // Garantir que todas as categorias estejam retraídas inicialmente
    const collapseAllCategories = (cats) => {
      if (!cats || !Array.isArray(cats)) return

      cats.forEach(category => {
        category.expanded = false

        if (category.children && category.children.length > 0) {
          collapseAllCategories(category.children)
        }
      })
    }

    // Colapsar todas as categorias primeiro
    collapseAllCategories(hierarchicalCategories)

    // Se temos um ID de categoria na rota, expandimos apenas essa categoria e seus pais
    if (route.params.slug) {
      console.log(`[CategoryPage] Expandindo categorias para a categoria selecionada: ${route.params.slug}`)
      categoryTree.value = categoryService.expandCategoriesForSelected(hierarchicalCategories, route.params.slug)
    } else {
      // Caso contrário, usar as categorias hierárquicas diretamente (todas retraídas)
      categoryTree.value = hierarchicalCategories
    }

    // Listar categorias para debug
    const listCategoriesWithPath = (tree, path = '') => {
      tree.forEach(category => {
        const currentPath = path ? `${path} > ${category.name}` : category.name
        console.log(`[CategoryPage] Categoria: ${currentPath} (ID: ${category.id})`)

        if (category.children && category.children.length > 0) {
          listCategoriesWithPath(category.children, currentPath)
        }
      })
    }

    listCategoriesWithPath(categoryTree.value)

    console.log(`[CategoryPage] Total de categorias raiz: ${categoryTree.value.length}`)
  } catch (err) {
    console.error('Error fetching categories:', err)
    error.value = 'Error loading categories'
    categories.value = []
    categoryTree.value = []
  } finally {
    loading.value = false
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
    console.log('Brands loaded:', brands.value)
  } catch (err) {
    console.error('Error fetching brands:', err)
    error.value = 'Error loading brands'
    brands.value = []
  }
}

// Função para atualizar o preço máximo com base na categoria selecionada
const updateMaxPrice = async () => {
  // Se o toggle master estiver desabilitado, não atualiza o preço máximo
  if (!showPrices.value) {
    console.log('Preços desabilitados, não atualizando o preço máximo');
    return;
  }

  try {
    // Busca o preço máximo dos produtos da categoria selecionada
    const categoryMaxPrice = await productService.getMaxPrice(selectedCategory.value, selectedBrands.value);

    console.log('Preço máximo obtido da API:', categoryMaxPrice);

    // Arredonda para o milheiro superior
    // Por exemplo, se o preço máximo for 2345, arredonda para 3000
    const roundedMaxPrice = Math.ceil(categoryMaxPrice / 1000) * 1000;

    // Define o valor máximo do filtro de preço
    // Garantindo que o valor mínimo seja 3000 para cobrir produtos com preços maiores que 1000
    maxPrice.value = Math.max(roundedMaxPrice, 3000);

    // Atualiza o intervalo de preço para usar o novo valor máximo
    priceRange.value = [0, maxPrice.value];

    console.log(`Preço máximo atualizado para: ${maxPrice.value}`);
  } catch (err) {
    console.error('Erro ao buscar preço máximo:', err);
    // Em caso de erro, define um valor padrão mais alto
    maxPrice.value = 3000;
    priceRange.value = [0, 3000];
  }
}

const getProductImage = (product) => {
  console.log(`[CategoryPage] Obtendo imagem para produto: ${product.id} - ${product.name}`);
  console.log(`[CategoryPage] Caminho da imagem original: ${product.image}`);
  console.log(`[CategoryPage] FoxPro code: ${product.foxpro_code}`);
  const imageUrl = imageService.getProductImageUrl(product.image, product);
  console.log(`[CategoryPage] Caminho da imagem processado: ${imageUrl}`);
  return imageUrl;
}

const handleImageError = (e) => {
  console.log('[CategoryPage] Erro ao carregar imagem, usando placeholder');
  e.target.src = PLACEHOLDER_IMAGE_PATH
  e.target.onerror = null // Previne loop infinito
}

const selectCategory = async (categoryId) => {
  console.log(`[CategoryPage] Iniciando selectCategory com categoryId: ${categoryId}`);

  // Se já tiver uma categoria selecionada e for a mesma que está sendo clicada, não faz nada
  if (selectedCategory.value === categoryId) {
    console.log(`[CategoryPage] Categoria ${categoryId} já está selecionada, ignorando`);
    return; // Não permite desmarcar a categoria
  }

  // Mostrar indicador de carregamento apenas para a lista de produtos
  // Isso evita que o filtro de categorias seja recarregado
  const productsGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6');
  if (productsGrid) {
    // Adiciona um overlay de carregamento apenas na lista de produtos
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10';
    loadingOverlay.id = 'products-loading-overlay';
    loadingOverlay.innerHTML = '<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-empire-yellow"></div>';

    // Adiciona posicionamento relativo ao grid de produtos se ainda não tiver
    if (window.getComputedStyle(productsGrid).position === 'static') {
      productsGrid.style.position = 'relative';
    }

    // Remove qualquer overlay existente antes de adicionar um novo
    const existingOverlay = document.getElementById('products-loading-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    productsGrid.appendChild(loadingOverlay);
  } else {
    // Fallback para o indicador de carregamento global se não encontrar o grid de produtos
    loading.value = true;
  }

  console.log(`[CategoryPage] Indicador de carregamento ativado apenas para produtos`);

  // Reset da página atual ao mudar de categoria
  currentPage.value = 1;
  console.log(`[CategoryPage] Página resetada para 1`);

  // Define a nova categoria selecionada
  console.log(`[CategoryPage] Alterando categoria selecionada de ${selectedCategory.value} para ${categoryId}`);
  selectedCategory.value = categoryId;

  try {
    // Busca as marcas relacionadas à categoria selecionada
    await fetchBrands(selectedCategory.value);
    selectedBrands.value = brands.value.map(brand => brand.id);

    // Atualiza o preço máximo com base na categoria selecionada
    await updateMaxPrice();

    // Busca produtos filtrados explicitamente (além do watcher)
    await fetchFilteredProducts();

    console.log('Categoria selecionada:', categoryId);
    console.log('Buscando produtos para a categoria:', selectedCategory.value);

    // Atualizar a URL sem recarregar a página
    try {
      console.log(`[CategoryPage] Atualizando URL para /categories/${categoryId}`);

      // Usar replace em vez de push para evitar problemas com o histórico
      // Usar replaceState diretamente para evitar qualquer recarregamento
      const newUrl = `/categories/${categoryId}${window.location.search}`;
      window.history.replaceState(null, '', newUrl);
      console.log(`[CategoryPage] URL atualizada para: ${newUrl}`);
    } catch (error) {
      console.error('[CategoryPage] Erro ao atualizar URL:', error);
    }

    // Rolar para o elemento de ordenação após um pequeno atraso para garantir que o DOM foi atualizado
    setTimeout(() => {
      console.log('[CategoryPage] Tentando rolar para o elemento de ordenação');

      // Encontrar o elemento que contém o combobox de ordenação
      const sortingElement = document.querySelector('.flex.justify-between.items-center.p-3.border-2.border-black');

      if (sortingElement) {
        console.log('[CategoryPage] Elemento de ordenação encontrado, rolando para ele');
        // Rolar suavemente para o elemento de ordenação
        sortingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log('[CategoryPage] Elemento de ordenação NÃO encontrado, tentando alternativas');
        // Tentar encontrar o elemento da lista de produtos
        const productsGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6');

        if (productsGrid) {
          console.log('[CategoryPage] Elemento da lista de produtos encontrado, rolando para ele');
          // Rolar suavemente para o topo da lista de produtos
          productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.log('[CategoryPage] Nenhum elemento encontrado, rolando para o topo da página');
          // Último fallback: rolar para o topo da página
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 300); // Aumentando o atraso para garantir que o DOM foi atualizado
  } catch (error) {
    console.error('Erro ao carregar produtos para a categoria:', error);
    // Exibir mensagem de erro para o usuário
    error.value = 'Erro ao carregar produtos para esta categoria';
  } finally {
    // Esconder indicador de carregamento
    loading.value = false;

    // Remover o overlay de carregamento da lista de produtos
    const loadingOverlay = document.getElementById('products-loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.remove();
      console.log('[CategoryPage] Overlay de carregamento removido');
    }
  }
}

const handleAddToCart = (product, quantity) => {
  // Verifica se o produto tem características que precisam ser selecionadas
  if (productCharacteristicsService.hasCharacteristics(product)) {
    // Se tiver características, redireciona para a página de detalhes do produto
    router.push({
      path: `/product/${product.id}`,
      query: { showValidation: 'true' } // Passa um parâmetro para mostrar a validação
    });
    return;
  }

  // Se não tiver características, adiciona diretamente ao carrinho
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
  // Mostrar indicador de carregamento apenas para a lista de produtos
  const productsGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6');
  if (productsGrid) {
    // Adiciona um overlay de carregamento apenas na lista de produtos
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10';
    loadingOverlay.id = 'products-loading-overlay';
    loadingOverlay.innerHTML = '<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-empire-yellow"></div>';

    // Adiciona posicionamento relativo ao grid de produtos se ainda não tiver
    if (window.getComputedStyle(productsGrid).position === 'static') {
      productsGrid.style.position = 'relative';
    }

    // Remove qualquer overlay existente antes de adicionar um novo
    const existingOverlay = document.getElementById('products-loading-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    productsGrid.appendChild(loadingOverlay);
  } else {
    // Fallback para o indicador de carregamento global se não encontrar o grid de produtos
    loading.value = true;
  }

  currentPage.value = page;

  try {
    await fetchFilteredProducts();

    // Rolar para o elemento de ordenação após um pequeno atraso para garantir que o DOM foi atualizado
    setTimeout(() => {
      console.log('[CategoryPage] Tentando rolar para o elemento de ordenação');

      // Encontrar o elemento que contém o combobox de ordenação
      const sortingElement = document.querySelector('.flex.justify-between.items-center.p-3.border-2.border-black');

      if (sortingElement) {
        console.log('[CategoryPage] Elemento de ordenação encontrado, rolando para ele');
        // Rolar suavemente para o elemento de ordenação
        sortingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log('[CategoryPage] Elemento de ordenação NÃO encontrado, tentando alternativas');
        // Tentar encontrar o elemento da lista de produtos
        const productsGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6');

        if (productsGrid) {
          console.log('[CategoryPage] Elemento da lista de produtos encontrado, rolando para ele');
          // Rolar suavemente para o topo da lista de produtos
          productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.log('[CategoryPage] Nenhum elemento encontrado, rolando para o topo da página');
          // Último fallback: rolar para o topo da página
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 300); // Aumentando o atraso para garantir que o DOM foi atualizado
  } catch (error) {
    console.error('Erro ao mudar de página:', error);
  } finally {
    // Esconder indicador de carregamento
    loading.value = false;

    // Remover o overlay de carregamento da lista de produtos
    const loadingOverlay = document.getElementById('products-loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.remove();
      console.log('[CategoryPage] Overlay de carregamento removido');
    }
  }
}

// Função para selecionar a primeira categoria
const selectFirstCategory = () => {
  console.log('[CategoryPage] Tentando selecionar a primeira categoria')

  // Verifica se há categorias filtradas disponíveis
  if (categoryTree.value && categoryTree.value.length > 0) {
    console.log(`[CategoryPage] Selecionando primeira categoria da árvore filtrada: ${categoryTree.value[0].name} (ID: ${categoryTree.value[0].id})`)
    // Seleciona a categoria diretamente sem atualizar a árvore
    selectCategory(categoryTree.value[0].id)
  } else if (categories.value && categories.value.length > 0) {
    // Fallback para o comportamento anterior
    console.log(`[CategoryPage] Nenhuma categoria filtrada disponível, usando primeira categoria não filtrada: ${categories.value[0].name} (ID: ${categories.value[0].id})`)
    // Seleciona a categoria diretamente sem atualizar a árvore
    selectCategory(categories.value[0].id)
  } else {
    console.log('[CategoryPage] Nenhuma categoria disponível para seleção')
  }
}



// Função para selecionar categoria por slug
const selectCategoryBySlug = async (slug) => {
  console.log(`[CategoryPage] Tentando selecionar categoria por slug: ${slug}`)

  // Primeiro, tenta encontrar a categoria na árvore filtrada
  if (categoryTree.value && categoryTree.value.length > 0) {
    console.log(`[CategoryPage] Buscando categoria com ID ${slug} na árvore filtrada`)

    // Função auxiliar para buscar categoria na árvore
    const findCategoryInTree = (tree, id) => {
      for (const node of tree) {
        if (node.id === id) {
          return node
        }
        if (node.children && node.children.length > 0) {
          const found = findCategoryInTree(node.children, id)
          if (found) return found
        }
      }
      return null
    }

    const categoryInTree = findCategoryInTree(categoryTree.value, slug)

    if (categoryInTree) {
      console.log(`[CategoryPage] Categoria encontrada na árvore filtrada: ${categoryInTree.name} (ID: ${categoryInTree.id})`)

      // Em vez de atualizar a árvore inteira, apenas marca a categoria como selecionada
      // e deixa o componente CategoryTreeItem lidar com a expansão
      await selectCategory(categoryInTree.id)
      return
    } else {
      console.log(`[CategoryPage] Categoria com ID ${slug} não encontrada na árvore filtrada`)
    }
  }

  // Se não encontrou na árvore filtrada, buscar diretamente do backend
  // mas sem recarregar toda a árvore de categorias
  try {
    console.log(`[CategoryPage] Buscando categoria com ID ${slug} diretamente do backend`)

    // Em vez de buscar todas as categorias novamente, apenas busca a categoria específica
    if (categories.value && categories.value.length > 0) {
      // Função auxiliar para buscar categoria na árvore
      const findCategoryInTree = (tree, id) => {
        for (const node of tree) {
          if (node.id === id) {
            return node
          }
          if (node.children && node.children.length > 0) {
            const found = findCategoryInTree(node.children, id)
            if (found) return found
          }
        }
        return null
      }

      const categoryInTree = findCategoryInTree(categories.value, slug)

      if (categoryInTree) {
        console.log(`[CategoryPage] Categoria encontrada nas categorias existentes: ${categoryInTree.name} (ID: ${categoryInTree.id})`)

        // Apenas seleciona a categoria sem atualizar a árvore
        await selectCategory(categoryInTree.id)
        return
      }
    }

    // Se ainda não encontrou, tenta buscar do backend como último recurso
    // mas apenas para obter o ID da categoria, não para atualizar a árvore
    console.log(`[CategoryPage] Categoria não encontrada localmente, buscando do backend como último recurso`)

    try {
      // Em vez de buscar todas as categorias, tenta buscar apenas a categoria específica
      // Isso é uma simulação, já que não temos um endpoint para buscar uma categoria específica
      await selectCategory(slug)
      return
    } catch (innerError) {
      console.error('Error selecting category by ID:', innerError)
    }
  } catch (error) {
    console.error('Error fetching category by slug:', error)
  }

  // Se chegou até aqui, seleciona a primeira categoria filtrada
  console.log(`[CategoryPage] Selecionando a primeira categoria filtrada como fallback`)
  if (categoryTree.value && categoryTree.value.length > 0) {
    await selectCategory(categoryTree.value[0].id)
  }
}

onMounted(async () => {
  try {
    console.log('Inicializando a página de categorias')
    await loadFinancialSettings()
    await fetchCategories()
    console.log('Categorias carregadas:', categories.value)

    if (route.params.slug) {
      console.log('Slug encontrado na rota:', route.params.slug)
      await selectCategoryBySlug(route.params.slug)
    } else {
      console.log('Nenhum slug na rota, selecionando a primeira categoria')
      selectFirstCategory()
    }

    console.log('Categoria selecionada após inicialização:', selectedCategory.value)
    await fetchFilteredProducts()
  } catch (err) {
    console.error('Error in initialization:', err)
    error.value = 'Error loading page'
  }
})

// Observar mudanças na rota para atualizar a categoria selecionada
watch(
  () => route.params.slug,
  async (newSlug) => {
    console.log('Slug da rota alterado para:', newSlug)
    if (newSlug) {
      // Verifica se a categoria já está selecionada para evitar recarregar
      if (selectedCategory.value !== newSlug) {
        console.log(`[CategoryPage] Categoria diferente da atual, atualizando seleção de ${selectedCategory.value} para ${newSlug}`)
        await selectCategoryBySlug(newSlug)
      } else {
        console.log(`[CategoryPage] Categoria ${newSlug} já está selecionada, apenas atualizando produtos`)
        // Apenas atualiza os produtos sem recarregar as categorias
        await fetchFilteredProducts()
      }
    } else {
      console.log('Slug removido da rota, selecionando a primeira categoria')
      selectFirstCategory()
    }
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

// Removidas funções não utilizadas relacionadas à busca de categorias e toggle de categorias com produtos

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
  -moz-appearance: none;
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

.loader {
  /* Adicione aqui o estilo do seu loader */
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FBBD1E;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
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
  appearance: none;
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
  appearance: none;
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
  overflow: hidden;
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
  overflow: hidden;
  margin-bottom: 1rem;
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

/* Estilos responsivos para o botão de adicionar ao carrinho */
.text-responsive-add-cart :deep(.font-archivo-narrow) {
  font-size: 18px; /* Tamanho base para mobile */
  line-height: 24px;
}

/* Tablet */
@media (min-width: 768px) {
  .text-responsive-add-cart :deep(.font-archivo-narrow) {
    font-size: 24px;
    line-height: 32px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .text-responsive-add-cart :deep(.font-archivo-narrow) {
    font-size: 34px;
    line-height: 72px;
  }
}
</style>
























