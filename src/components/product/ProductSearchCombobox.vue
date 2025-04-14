<template>
  <div class="product-search-combobox w-full">
    <!-- Toast Message -->
    <div
      v-if="showToast"
      class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-black text-empire-yellow px-4 sm:px-6 py-3 sm:py-4 rounded-md shadow-lg z-50 transition-opacity duration-300 text-center sm:text-left"
      :class="{ 'opacity-0': !showToast, 'opacity-100': showToast }"
    >
      <p class="font-archivo-narrow text-base sm:text-lg">
        {{ $t('cart.productAdded') }}
      </p>
    </div>
    <div class="relative">
      <!-- Campo de pesquisa -->
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="$t('productSearch.searchPlaceholder')"
          class="w-full p-3 sm:p-4 pr-10 sm:pr-12 border-2 border-black/25 rounded font-archivo text-sm sm:text-base focus:outline-none focus:border-empire-yellow"
          @focus="showResults = true"
          @input="debouncedSearch"
        />
        <div class="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Resultados da pesquisa -->
      <div v-if="showResults && searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-black/25 rounded shadow-lg max-h-[300px] sm:max-h-[400px] overflow-y-auto">
        <div v-for="product in searchResults" :key="product.id" class="product-item border-b border-gray-200 last:border-b-0 py-1">
          <div class="flex flex-col sm:flex-row items-start sm:items-center p-4 hover:bg-gray-100 cursor-pointer" @click="selectProduct(product)">
            <!-- Layout para desktop -->
            <div class="hidden sm:flex sm:flex-row sm:items-center sm:w-full">
              <img
                :src="product.image || '/images/products/no-image.png'"
                :alt="product.name"
                class="w-16 h-16 object-cover mr-4"
                @error="handleImageError"
              />
              <div class="flex-grow">
                <div class="font-archivo-narrow font-semibold text-lg">{{ product.name }}</div>
                <div class="font-archivo text-sm text-black/70 truncate">{{ product.description }}</div>
                <div v-if="showPrices" class="font-archivo text-base text-black/70 mt-1">{{ formatPrice(product.price) }}</div>
              </div>
              <div class="flex items-center">
                <div class="flex border border-black/25 mr-2">
                  <button
                    @click.stop="decreaseQuantity(product)"
                    class="px-2 py-1 hover:bg-black/5"
                  >
                    -
                  </button>
                  <span class="px-3 py-1">{{ getProductQuantity(product) }}</span>
                  <button
                    @click.stop="increaseQuantity(product)"
                    class="px-2 py-1 hover:bg-black/5"
                  >
                    +
                  </button>
                </div>
                <button
                  @click.stop="addToCart(product)"
                  class="bg-empire-yellow px-3 py-1 font-archivo-narrow font-semibold text-sm hover:opacity-90"
                >
                  {{ $t('cart.addToCart') }}
                </button>
              </div>
            </div>

            <!-- Layout otimizado para mobile -->
            <div class="flex sm:hidden flex-row w-full">
              <img
                :src="product.image || '/images/products/no-image.png'"
                :alt="product.name"
                class="w-16 h-16 object-cover mr-4 flex-shrink-0"
                @error="handleImageError"
              />
              <div class="flex-grow flex flex-col justify-between">
                <div>
                  <div class="font-archivo-narrow font-semibold text-[15px] line-clamp-1 mb-1.5">{{ product.name }}</div>
                  <div class="font-archivo text-xs text-black/70 truncate mb-1.5">{{ product.description }}</div>
                  <div v-if="showPrices" class="font-archivo text-sm text-black/70 mb-3">{{ formatPrice(product.price) }}</div>
                </div>

                <div class="flex items-center">
                  <div class="flex border border-black/25 mr-2 h-7">
                    <button
                      @click.stop="decreaseQuantity(product)"
                      class="px-2 hover:bg-black/5 text-sm flex items-center justify-center w-7"
                    >
                      -
                    </button>
                    <span class="px-2 py-0.5 text-sm flex items-center justify-center min-w-[24px]">{{ getProductQuantity(product) }}</span>
                    <button
                      @click.stop="increaseQuantity(product)"
                      class="px-2 hover:bg-black/5 text-sm flex items-center justify-center w-7"
                    >
                      +
                    </button>
                  </div>
                  <button
                    @click.stop="addToCart(product)"
                    class="bg-empire-yellow px-3 py-1 font-archivo-narrow font-semibold text-sm hover:opacity-90 h-7 flex items-center justify-center min-w-[80px]"
                  >
                    {{ $t('cart.addToCart') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem de nenhum resultado -->
      <div v-else-if="showResults && searchQuery && !loading" class="absolute z-10 w-full mt-1 bg-white border border-black/25 rounded shadow-lg p-3 sm:p-4 text-center">
        <p class="font-archivo text-sm sm:text-base text-black/70">{{ $t('productSearch.noResults') }}</p>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading && showResults" class="absolute z-10 w-full mt-1 bg-white border border-black/25 rounded shadow-lg p-3 sm:p-4 text-center">
        <p class="font-archivo text-sm sm:text-base text-black/70">{{ $t('common.loading') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { productService } from '@/services/productService'
import { useCartStore } from '@/stores/cartStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { settingsService } from '@/services/settingsService'
import { PLACEHOLDER_IMAGE_PATH } from '@/services/imageConstants'

export default {
  name: 'ProductSearchCombobox',
  setup() {
    useI18n() // Importamos mas não usamos diretamente
    const cartStore = useCartStore()
    const togglesStore = useFinancialTogglesStore()

    const searchQuery = ref('')
    const searchResults = ref([])
    const showResults = ref(false)
    const loading = ref(false)
    const currencySymbol = ref('$')
    const showPrices = ref(true)
    const showToast = ref(false)

    // Mapa para armazenar as quantidades selecionadas para cada produto
    const selectedQuantities = reactive({})

    // Debounce para a pesquisa
    let debounceTimeout = null

    const debouncedSearch = () => {
      clearTimeout(debounceTimeout)
      if (searchQuery.value.trim() === '') {
        searchResults.value = []
        return
      }

      loading.value = true
      debounceTimeout = setTimeout(() => {
        searchProducts()
      }, 300)
    }

    const searchProducts = async () => {
      if (searchQuery.value.trim() === '') {
        searchResults.value = []
        loading.value = false
        return
      }

      try {
        // Usa o mesmo método que o header usa para buscar produtos
        const response = await productService.getProducts({
          search: searchQuery.value,
          limit: 10
        })
        searchResults.value = response.items || []

        // Inicializa as quantidades para os produtos encontrados
        searchResults.value.forEach(product => {
          if (!selectedQuantities[product.id]) {
            selectedQuantities[product.id] = 1
          }
        })
      } catch (error) {
        console.error('Error searching products:', error)
        searchResults.value = []
      } finally {
        loading.value = false
      }
    }

    const selectProduct = (product) => {
      // Redireciona para a página de detalhes do produto
      window.location.href = `/product/${product.id}`
    }

    const getProductQuantity = (product) => {
      return selectedQuantities[product.id] || 1
    }

    const increaseQuantity = (product) => {
      if (!selectedQuantities[product.id]) {
        selectedQuantities[product.id] = 1
      }
      selectedQuantities[product.id]++
    }

    const decreaseQuantity = (product) => {
      if (!selectedQuantities[product.id]) {
        selectedQuantities[product.id] = 1
      }
      if (selectedQuantities[product.id] > 1) {
        selectedQuantities[product.id]--
      }
    }

    const addToCart = (product) => {
      const quantity = selectedQuantities[product.id] || 1

      cartStore.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '/images/products/no-image.png',
        quantity: quantity
      })

      // Reset quantity after adding to cart
      selectedQuantities[product.id] = 1

      // Show toast notification
      showSuccessToast()
    }

    const showSuccessToast = () => {
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000) // Toast desaparece após 3 segundos
    }

    const handleImageError = (e) => {
      e.target.src = PLACEHOLDER_IMAGE_PATH
      e.target.onerror = null // Previne loop infinito
    }

    const formatPrice = (price) => {
      return `${currencySymbol.value}${Number(price).toFixed(2)}`
    }

    const loadFinancialSettings = async () => {
      try {
        const settings = await settingsService.getFinancialSettings()
        currencySymbol.value = settings.currency_symbol

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
      } catch (error) {
        console.error('Error loading financial settings:', error)
      }
    }

    // Fecha os resultados quando clicar fora do componente
    const handleClickOutside = (event) => {
      const combobox = document.querySelector('.product-search-combobox')
      if (combobox && !combobox.contains(event.target)) {
        showResults.value = false
      }
    }

    onMounted(() => {
      loadFinancialSettings()
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    // Observa mudanças no toggle master
    watch(() => togglesStore.masterToggle, (newValue) => {
      showPrices.value = newValue
    })

    return {
      searchQuery,
      searchResults,
      showResults,
      loading,
      selectedQuantities,
      showPrices,
      showToast,
      debouncedSearch,
      selectProduct,
      getProductQuantity,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      showSuccessToast,
      handleImageError,
      formatPrice
    }
  }
}
</script>

<style scoped>
.product-search-combobox {
  position: relative;
}

/* Estilização da barra de rolagem */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #FFDD00 #D9D9D9;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #D9D9D9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #FFDD00;
}

/* Limita o texto a uma linha com elipse */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsividade já está implementada com classes do Tailwind */
</style>
