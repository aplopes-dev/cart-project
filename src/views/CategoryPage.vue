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

                <!-- Lista de Categorias -->
                <div class="border border-[#FAFAFA] transform rotate-[0.21deg] mb-12">
                  <div class="flex flex-col gap-3">
                    <div 
                      v-for="category in categories" 
                      :key="category.id"
                      class="flex items-center px-6 py-1 gap-3 h-[24.09px]"
                    >
                      <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                      <span class="font-archivo text-[20px] leading-[22px] text-black/70">
                        {{ category.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

                <!-- Filtro de Preço -->
                <div class="flex flex-col gap-12 w-[328px] mb-12">
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
                        ${{ priceRange[0] }}
                      </span>
                      <span class="font-archivo text-sm">
                        ${{ priceRange[1] }}
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
                      >
                      <input
                        type="range"
                        :min="0"
                        :max="maxPrice"
                        v-model.number="priceRange[1]"
                        class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none"
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
                        <span class="font-archivo text-[20px] leading-[22px] text-black/70">
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
              <!-- Ícone de Filtro - Visível apenas em mobile -->
              <button 
                @click="toggleMobileFilters"
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
                {{ $t('categoryPage.showingResults', { count: filteredProducts.length }) }}
              </span>
            </div>
            
            <div class="flex justify-end w-[240px]">
              <div class="relative w-full">
                <select class="w-full h-10 px-4 py-2 bg-white border border-[#D9D9D9] font-inter text-sm appearance-none cursor-pointer">
                  <option value="1">{{ $t('categoryPage.sortBy.featured') }}</option>
                  <option value="2">{{ $t('categoryPage.sortBy.priceLowHigh') }}</option>
                  <option value="3">{{ $t('categoryPage.sortBy.priceHighLow') }}</option>
                  <option value="4">{{ $t('categoryPage.sortBy.nameAZ') }}</option>
                  <option value="5">{{ $t('categoryPage.sortBy.nameZA') }}</option>
                </select>
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#FFDD00]">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="#1E1E1E"/>
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
              <div class="border border-[#FAFAFA] p-4">
                <!-- Conteúdo do filtro de categorias -->
                <div class="flex flex-col gap-3">
                  <div 
                    v-for="category in categories" 
                    :key="category.id"
                    class="flex items-center gap-3"
                  >
                    <svg class="w-6 h-6 rotate-[-90deg]" viewBox="0 0 24 24" fill="#FBBD1E">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                    <span class="font-archivo text-[20px] leading-[22px] text-black/70">
                      {{ category.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filtro de Preço -->
            <div class="mb-6">
              <div class="flex items-center w-full h-[72.66px] bg-black border-b-[5px] border-b-empire-yellow">
                <h3 class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-empire-yellow px-6">
                  {{ $t('categoryPage.price') }}
                </h3>
              </div>
              <div class="border border-[#FAFAFA] p-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-archivo text-sm">
                    ${{ priceRange[0] }}
                  </span>
                  <span class="font-archivo text-sm">
                    ${{ priceRange[1] }}
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
                  >
                  <input
                    type="range"
                    :min="0"
                    :max="maxPrice"
                    v-model.number="priceRange[1]"
                    class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none"
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
            <div 
              v-for="product in filteredProducts" 
              :key="product.id" 
              class="flex flex-col bg-white border border-[#FAFAFA] h-[700px]"
            >
              <img 
                :src="product.image" 
                :alt="product.name"
                class="w-full aspect-square object-cover"
                @error="handleImageError"
              >
              <div class="p-4 flex flex-col h-[300px]">
                <h3 class="font-archivo-narrow font-semibold text-[28px] leading-[32px] text-black/70 h-[64px] line-clamp-2">
                  {{ product.name }}
                </h3>
                <p class="font-archivo text-lg text-black/70 h-[72px] line-clamp-3 mb-auto">
                  {{ product.description }}
                </p>
                <div class="mt-auto w-full">
                  <p class="font-archivo-narrow font-semibold text-[28px] leading-[32px] mb-4">
                    ${{ product.price.toFixed(2) }}
                  </p>
                  <div class="w-full">
                    <ProductQuantitySelector 
                      @add-to-cart="(quantity) => addToCart(product, quantity)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginação -->
          <div class="flex flex-col items-center mt-12 mb-24 w-full gap-4">
            <div class="flex justify-center items-center gap-2 md:gap-4 w-full">
              <!-- Botão Previous -->
              <button class="flex items-center justify-center h-10 px-2 md:px-4 gap-1 bg-[#F9F9FB] rounded-lg min-w-[90px] md:min-w-[120px]">
                <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="font-inter font-medium text-sm md:text-base">{{ $t('categoryPage.previous') }}</span>
              </button>

              <!-- Números das Páginas -->
              <div class="flex gap-1 md:gap-2">
                <button 
                  v-for="page in 5" 
                  :key="page"
                  class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-sm md:text-base"
                  :class="page === 1 ? 'bg-black text-white' : 'bg-[#F9F9FB] text-black'"
                >
                  {{ page }}
                </button>
              </div>

              <!-- Botão Next -->
              <button class="flex items-center justify-center h-10 px-2 md:px-4 gap-1 bg-[#F9F9FB] rounded-lg min-w-[90px] md:min-w-[120px]">
                <span class="font-inter font-medium text-sm md:text-base">{{ $t('categoryPage.next') }}</span>
                <svg class="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <!-- Contador de Items -->
            <div class="flex justify-center">
              <span class="font-inter text-sm md:text-base">
                {{ $t('categoryPage.itemsCount', { start: 1, end: filteredProducts.length, total: totalItems }) }}
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
          <!-- Filtro de Preço -->
          <div>
            <h3 class="font-archivo-narrow font-semibold text-2xl mb-4">{{ $t('categoryPage.priceRange') }}</h3>
            <div class="space-y-2">
              <label v-for="range in priceRanges" :key="range.id" class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  :value="range.id"
                  v-model="selectedPriceRanges"
                  class="w-5 h-5"
                >
                <span class="font-archivo text-lg">{{ range.label }}</span>
              </label>
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
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProductQuantitySelector from '@/components/product/ProductQuantitySelector.vue'

useI18n()

const isMobileFiltersExpanded = ref(false)

const toggleMobileFilters = () => {
  isMobileFiltersExpanded.value = !isMobileFiltersExpanded.value
}

// Mock data
const categories = ref([
  { id: 1, name: 'Plumbing', slug: 'plumbing' },
  { id: 2, name: 'Heating', slug: 'heating' },
  { id: 3, name: 'Tools', slug: 'tools' }
]);

const brands = ref([
  { id: 1, name: 'Brand 1' },
  { id: 2, name: 'Brand 2' },
  { id: 3, name: 'Brand 3' }
]);

const currentPage = ref(1)
// eslint-disable-next-line no-unused-vars
const totalPages = ref(100)
// eslint-disable-next-line no-unused-vars
const itemsPerPage = ref(12)
// eslint-disable-next-line no-unused-vars
const totalItems = ref(2589)

// eslint-disable-next-line no-unused-vars
const handlePageChange = (page) => {
  currentPage.value = page
  // Aqui você pode adicionar a lógica para buscar os produtos da página selecionada
}
</script>

<script>
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
      products: [
        {
          id: 1,
          name: 'Pipe Wrench',
          description: 'Heavy duty pipe wrench for professional use',
          price: 199.99,
          image: '/img/product1.png',
          brandId: 1
        },
        {
          id: 2,
          name: 'Copper Fitting',
          description: 'Premium quality copper pipe fitting',
          price: 299.99,
          image: '/img/product2.png',
          brandId: 2
        },
        {
          id: 3,
          name: 'PVC Pipe',
          description: 'High-grade PVC pipe for plumbing',
          price: 159.99,
          image: '/img/product3.png',
          brandId: 1
        },
        {
          id: 4,
          name: 'Adjustable Wrench',
          description: 'Professional grade adjustable wrench',
          price: 399.99,
          image: '/img/product1.png',
          brandId: 3
        },
        {
          id: 5,
          name: 'Pipe Cutter',
          description: 'Precision pipe cutting tool',
          price: 249.99,
          image: '/img/product2.png',
          brandId: 2
        },
        {
          id: 6,
          name: 'Plumbing Kit',
          description: 'Complete professional plumbing kit',
          price: 179.99,
          image: '/img/product3.png',
          brandId: 1
        },
        {
          id: 7,
          name: 'Tool Set',
          description: 'Comprehensive plumbing tool set',
          price: 289.99,
          image: '/img/product2.png',
          brandId: 3
        },
        {
          id: 8,
          name: 'Pipe Sealer',
          description: 'Professional grade pipe sealing compound',
          price: 199.99,
          image: '/img/product1.png',
          brandId: 2
        },
        {
          id: 9,
          name: 'Drain Snake',
          description: 'Professional plumbing auger tool',
          price: 349.99,
          image: '/img/product3.png',
          brandId: 1
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products]

      // Filtro de preço
      filtered = filtered.filter(product => {
        return product.price >= this.priceRange[0] && product.price <= this.priceRange[1]
      })

      // Filtro de marcas
      if (this.selectedBrands.length > 0) {
        filtered = filtered.filter(product => 
          this.selectedBrands.includes(product.brandId)
        )
      }

      return filtered
    }
  },
  methods: {
    handleImageError(e) {
      e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image'
    },
    addToCart(product, quantity) {
      console.log('Adding to cart:', product, 'quantity:', quantity)
      // Aqui você pode implementar a lógica para adicionar ao carrinho
    }
  }
}
</script>
<style scoped>
input[type="range"]::-webkit-slider-thumb {
  @apply pointer-events-auto;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #2C2C2C;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply pointer-events-auto;
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
</style>
