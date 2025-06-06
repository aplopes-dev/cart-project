<template>
  <div class="shopping-cart-page">
    <!-- Mensagem de erro -->
    <div
      v-if="showError"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>



    <div class="container mx-auto px-4 py-8">
      <!-- Loading Spinner -->
      <div v-if="loading" class="py-16 max-w-[1408px] mx-auto">
        <LoadingSpinner />
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="py-16 text-center max-w-[1408px] mx-auto">
        <p class="text-red-500 text-lg mb-4">{{ error }}</p>
        <button @click="loadCart" class="bg-empire-yellow px-6 py-2 font-archivo-narrow font-semibold">
          {{ $t('common.retry') }}
        </button>
      </div>

      <div v-else class="max-w-[1408px] mx-auto">
        <!-- Título Principal -->
        <div class="pt-0 pb-4 md:pb-6 text-center">
          <h1 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-[30px] md:leading-[40px]">{{ $t('shoppingCart.title') }}</h1>
        </div>

        <!-- Área de Pesquisa de Produtos -->
        <div class="mb-6 sm:mb-8">
          <h2 class="font-archivo-narrow font-semibold text-lg sm:text-xl mb-4 sm:mb-5 text-left">{{ $t('productSearch.title') }}</h2>
          <ProductSearchCombobox />
        </div>

        <!-- Header com títulos das colunas -->
        <div class="hidden md:grid grid-cols-12 gap-4 py-6 border-b border-black/25">
          <div class="col-span-6">
            <span class="font-archivo-narrow font-semibold text-xl">{{ $t('shoppingCart.product') }}</span>
          </div>
          <div class="col-span-3">
            <span class="font-archivo-narrow font-semibold text-xl ml-[100px]">{{ $t('shoppingCart.quantity') }}</span>
          </div>
          <div v-if="showPrices" class="col-span-3 text-right">
            <span class="font-archivo-narrow font-semibold text-xl">{{ $t('shoppingCart.total') }}</span>
          </div>
        </div>

        <!-- Lista de Produtos -->
        <div class="space-y-4 md:space-y-6 py-4 md:py-6">
          <div v-for="(item, index) in cartItems" :key="index"
               class="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 pb-4 md:pb-6 border-b border-black/25">
            <!-- Produto Info -->
            <div class="col-span-1 md:col-span-6">
              <div class="flex gap-1 md:gap-2 lg:gap-4 items-center">
                <router-link :to="`/product/${item.id}`">
                  <div class="cart-item-image">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="max-w-full max-h-full"
                      @error="handleImageError"
                    />
                  </div>
                </router-link>
                <div class="flex flex-col gap-1 justify-center">
                  <!-- Descrição do produto em destaque -->
                  <p v-if="productDetails[item.id]?.description" class="font-archivo font-bold text-sm md:text-base lg:text-lg text-black/90 line-clamp-2 md:line-clamp-2">
                    <router-link :to="`/product/${item.id}`" class="hover:text-empire-yellow transition-colors">
                      {{ productDetails[item.id].description }}
                    </router-link>
                  </p>

                  <!-- Nome do produto com fonte mais leve -->
                  <h3 class="font-archivo-narrow text-xs md:text-sm lg:text-base line-clamp-1 md:line-clamp-1 product-name">
                    <router-link :to="`/product/${item.id}`" class="hover:text-empire-yellow transition-colors">
                      {{ item.name }}
                    </router-link>
                  </h3>

                  <!-- Options -->
                  <div class="mt-0.5 md:mt-2">
                    <p class="font-archivo text-xs md:text-sm lg:text-base text-black/70 line-clamp-1 md:line-clamp-none">{{ item.description }}</p>

                    <!-- Características do produto -->
                    <div v-if="item.color || item.size || item.weight" class="mt-0.5 md:mt-1 space-y-0.5 md:space-y-0.5">
                      <p v-if="item.color" class="font-archivo text-xs md:text-sm lg:text-base text-black/70 flex items-center gap-1 md:gap-2">
                        <span class="font-semibold">{{ $t('productDetails.selectColor') }}:</span>
                        <span class="flex items-center gap-1 md:gap-2">
                          <ColorCircle :color="item.color" :size="12" class="md:w-4 md:h-4" />
                        </span>
                      </p>
                      <p v-if="item.size" class="font-archivo text-xs md:text-sm lg:text-base text-black/70">
                        <span class="font-semibold">{{ $t('productDetails.selectSize') }}:</span> {{ item.size }}
                      </p>
                      <p v-if="item.weight" class="font-archivo text-xs md:text-sm lg:text-base text-black/70">
                        <span class="font-semibold">{{ $t('productDetails.selectWeight') }}:</span> {{ item.weight }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div class="col-span-1 md:col-span-3 flex items-center md:items-center md:justify-center">
              <!-- Seletor de quantidade - Desktop -->
              <div class="hidden md:flex items-center border border-black/25 mr-4">
                <button @click="decreaseQuantity(index)"
                        class="px-4 py-2 text-xl hover:bg-black/5">-</button>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  class="quantity-input px-4 py-2 text-xl w-16 text-center"
                  :aria-label="$t('cart.quantity')"
                  @change="validateAndUpdateQuantity(index, item)"
                />
                <button @click="increaseQuantity(index)"
                        class="px-4 py-2 text-xl hover:bg-black/5">+</button>
              </div>

              <!-- Versão Mobile: Flex container para alinhar à direita -->
              <div class="flex md:hidden items-center ml-auto">
                <!-- Seletor de quantidade - Mobile (mais largo e menos alto) -->
                <div class="flex items-center border border-black/25 h-8 w-[100px] md:w-[140px]">
                  <button @click="decreaseQuantity(index)"
                          class="px-2 md:px-3 h-full flex items-center justify-center text-base md:text-lg hover:bg-black/5 w-8 md:w-12">-</button>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    min="1"
                    class="quantity-input flex-1 h-full text-center text-base md:text-lg"
                    :aria-label="$t('cart.quantity')"
                    @change="validateAndUpdateQuantity(index, item)"
                  />
                  <button @click="increaseQuantity(index)"
                          class="px-2 md:px-3 h-full flex items-center justify-center text-base md:text-lg hover:bg-black/5 w-8 md:w-12">+</button>
                </div>

                <!-- Ícone de Lixeira - Mobile (mesma altura do seletor de quantidade) -->
                <button
                  @click="removeItem(index)"
                  class="w-7 h-7 md:w-8 md:h-8 ml-1 md:ml-2 flex items-center justify-center hover:bg-[#E30505]/10 transition-colors rounded-sm"
                >
                  <svg width="20" height="20" class="md:w-6 md:h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8H28" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M25.3333 8V26.6667C25.3333 27.0203 25.1929 27.3594 24.9428 27.6095C24.6928 27.8595 24.3536 28 24 28H8C7.64638 28 7.30724 27.8595 7.05719 27.6095C6.80714 27.3594 6.66667 27.0203 6.66667 26.6667V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.6667 8V5.33333C10.6667 4.97971 10.8071 4.64057 11.0572 4.39052C11.3072 4.14048 11.6464 4 12 4H20C20.3536 4 20.6928 4.14048 20.9428 4.39052C21.1929 4.64057 21.3333 4.97971 21.3333 5.33333V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.3333 14.6667V21.3333" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.6667 14.6667V21.3333" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>

              <!-- Ícone de Lixeira - Desktop -->
              <button
                @click="removeItem(index)"
                class="hidden md:flex w-8 h-8 items-center justify-center hover:bg-[#E30505]/10 transition-colors rounded-sm"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8H28" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M25.3333 8V26.6667C25.3333 27.0203 25.1929 27.3594 24.9428 27.6095C24.6928 27.8595 24.3536 28 24 28H8C7.64638 28 7.30724 27.8595 7.05719 27.6095C6.80714 27.3594 6.66667 27.0203 6.66667 26.6667V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.6667 8V5.33333C10.6667 4.97971 10.8071 4.64057 11.0572 4.39052C11.3072 4.14048 11.6464 4 12 4H20C20.3536 4 20.6928 4.14048 20.9428 4.39052C21.1929 4.64057 21.3333 4.97971 21.3333 5.33333V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.3333 14.6667V21.3333" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.6667 14.6667V21.3333" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <!-- Total (exibido apenas se o toggle master estiver habilitado) -->
            <div v-if="showPrices" class="col-span-1 md:col-span-3 flex items-start justify-between md:justify-end">
              <span class="md:hidden font-archivo-narrow font-semibold text-base md:text-xl">{{ $t('shoppingCart.total') }}</span>
              <span class="font-archivo-narrow font-semibold text-base md:text-xl">
                {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Notes Section (oculta) -->
        <div v-if="false" class="py-4 md:py-6 border-b border-black/25">
          <button
            class="font-archivo-narrow font-semibold text-lg md:text-xl hover:opacity-70 flex items-center gap-2"
            @click="toggleNotes"
          >
            {{ $t('shoppingCart.addNotes') }}
            <svg
              class="w-6 h-6 transition-transform"
              :class="{ 'rotate-180': showNotes }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Textarea para notas -->
          <div v-if="showNotes" class="mt-4">
            <textarea
              v-model="notes"
              rows="4"
              class="w-full p-4 border-2 border-black/25 rounded font-arquivo text-base resize-none focus:outline-none focus:border-black"
              :placeholder="$t('shoppingCart.notesPlaceholder')"
              @input="checkoutStore.setOrderNotes($event.target.value)"
            ></textarea>
          </div>
        </div>

        <!-- Summary -->
        <div class="py-4 md:py-6 max-w-[456px] ml-auto">
          <div v-if="showPrices" class="flex justify-between items-center mb-4">
            <span class="font-archivo-narrow font-semibold text-lg md:text-xl">{{ $t('shoppingCart.subtotal') }}</span>
            <span class="font-archivo-narrow font-semibold text-lg md:text-xl">
              {{ formatPrice(subtotal) }}
            </span>
          </div>

          <p v-if="showPrices" class="font-archivo text-sm md:text-base text-black/70 mb-4 md:mb-6">
            {{ $t('shoppingCart.taxesAndShipping') }}
          </p>

          <button
            class="w-full bg-empire-yellow py-3 md:py-4 font-archivo-narrow font-semibold text-xl md:text-2xl hover:opacity-90"
            @click="handleButtonClick"
          >
            {{ cartItems.length ? $t('cart.checkout') : $t('shoppingCart.continueShopping') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cartStore'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { productService } from '@/services/productService'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { settingsService } from '@/services/settingsService'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
// eslint-disable-next-line no-unused-vars
import ColorCircle from '@/components/common/ColorCircle.vue'
// eslint-disable-next-line no-unused-vars
import { productCharacteristicsService } from '@/services/productCharacteristicsService'
import { PLACEHOLDER_IMAGE_PATH } from '@/services/imageConstants'
import ProductSearchCombobox from '@/components/product/ProductSearchCombobox.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default defineComponent({
  name: 'ShoppingCartPage',
  components: {
    ColorCircle,
    ProductSearchCombobox,
    LoadingSpinner
  },
  setup() {
    const cartStore = useCartStore()
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { t, locale } = useI18n()
    const currencySymbol = ref('$')
    const checkoutStore = useCheckoutStore()
    const togglesStore = useFinancialTogglesStore()
    const showPrices = ref(true) // Controla a visibilidade dos preços
    const productDetails = ref({})
    const loading = ref(true) // Estado de carregamento
    const error = ref(null) // Estado de erro

    // Watch para atualizar descrições quando mudar o idioma
    watch(locale, (newLocale) => {
      Object.keys(productDetails.value).forEach(productId => {
        if (productDetails.value[productId]) {
          productDetails.value[productId] = {
            ...productDetails.value[productId],
            description: productDetails.value[productId][`description_${newLocale}`] ||
                        productDetails.value[productId].description_en || ''
          }
        }
      })
    })

    const loadCurrencySymbol = async () => {
      try {
        // Não definimos loading.value = false aqui, pois isso será feito no loadCart
        error.value = null

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
        console.log('Master toggle state:', togglesStore.masterToggle)
        console.log('Show prices:', showPrices.value)
      } catch (err) {
        console.error('Error loading financial settings:', err)
        error.value = 'Failed to load financial settings'
        throw err; // Propaga o erro para ser tratado no loadCart
      }
    }

    // Mover estados para composables
    const showError = ref(false)
    const errorMessage = ref('')

    // Mover showErrorMessage para dentro do setup
    const showErrorMessage = (message) => {
      errorMessage.value = message
      showError.value = true

      // Limpar a query string
      router.replace({
        query: {}
      })

      // Esconder a mensagem após 5 segundos
      setTimeout(() => {
        showError.value = false
      }, 5000)
    }

    onMounted(() => {
      loadCart()
      if (route.query.error === 'empty_cart') {
        showErrorMessage(t('cart.emptyCart'))
      }
    })

    const fetchProductDetails = async (productId) => {
      try {
        const details = await productService.getProductDetails(productId)
        productDetails.value[productId] = {
          ...details,
          description: details[`description_${locale.value}`] || details.description_en || ''
        }
      } catch (error) {
        console.error(`Error fetching details for product ${productId}:`, error)
      }
    }

    const loadCart = async () => {
      try {
        loading.value = true
        error.value = null

        // Adicionando um pequeno atraso para garantir que o loading seja exibido
        await new Promise(resolve => setTimeout(resolve, 300))

        // Carrega as configurações financeiras
        await loadCurrencySymbol()

        // Carrega os detalhes dos produtos no carrinho
        if (cartStore.items.length > 0) {
          for (const item of cartStore.items) {
            await fetchProductDetails(item.id)
          }
        }
      } catch (err) {
        console.error('Error loading cart:', err)
        error.value = 'Failed to load cart details'
      } finally {
        loading.value = false
      }
    }

    watch(() => cartStore.items, (items) => {
      if (items) {
        items.forEach(item => {
          if (!productDetails.value[item.id]) {
            fetchProductDetails(item.id)
          }
        })
      }
    }, { immediate: true })

    return {
      cartStore,
      store,
      router,
      showError,
      errorMessage,
      showErrorMessage,
      currencySymbol,
      checkoutStore,
      productDetails,
      showPrices,
      loading,
      error,
      loadCart
    }
  },
  data() {
    return {
      showNotes: false,
      notes: ''
    }
  },
  computed: {
    cartItems() {
      return this.cartStore.items
    },
    subtotal() {
      return this.cartStore.subtotal // Usar diretamente o valor do store
    }
  },
  methods: {
    handleImageError(e) {
      e.target.src = PLACEHOLDER_IMAGE_PATH
      e.target.onerror = null // Previne loop infinito
      e.target.style.maxWidth = '90%'
      e.target.style.maxHeight = '90%'
      e.target.style.objectFit = 'contain'
    },
    toggleNotes() {
      this.showNotes = !this.showNotes
    },
    async increaseQuantity(index) {
      const item = this.cartItems[index]

      // Verifica se o produto tem características
      if (item.id) {
        try {
          // Busca os detalhes completos do produto para verificar as características
          const productDetails = await productService.getProductDetails(item.id)

          // Verifica se o produto tem características e se todas foram selecionadas
          if (productCharacteristicsService.hasCharacteristics(productDetails)) {
            // Verifica se todas as características necessárias já foram selecionadas
            const selectedCharacteristics = {
              color: item.color,
              size: item.size,
              weight: item.weight
            }

            // Se não tiver todas as características selecionadas, redireciona para a página de detalhes
            if (!productCharacteristicsService.allCharacteristicsSelected(productDetails, selectedCharacteristics)) {
              this.$router.push({
                path: `/product/${item.id}`,
                query: { showValidation: 'true' }
              })
              return
            }
          }
        } catch (error) {
          console.error('Erro ao buscar detalhes do produto:', error)
        }
      }

      // Se não tiver características ou todas já estiverem selecionadas, aumenta a quantidade normalmente
      this.cartStore.updateQuantity(index, item.quantity + 1)
    },
    decreaseQuantity(index) {
      const item = this.cartItems[index]
      if (item.quantity > 1) {
        this.cartStore.updateQuantity(index, item.quantity - 1)
      }
    },
    removeItem(index) {
      this.cartStore.removeItem(index)
    },
    handleButtonClick() {
      console.log('=== Debug Checkout Flow ===')
      const hasToken = !!localStorage.getItem('token')
      const isAuthenticated = this.store.state.isAuthenticated || hasToken

      if (this.cartItems.length > 0) {
        if (!isAuthenticated) {
          console.log('User not authenticated, redirecting to login...')
          this.$router.push({
            name: 'Login',
            query: { redirect: '/checkout' }
          })
        } else {
          console.log('User authenticated, proceeding to checkout...')
          this.$router.push({ name: 'Checkout' })
        }
      } else {
        this.$router.push('/categories')
      }
    },
    formatPrice(price) {
      return `${this.currencySymbol}${Number(price).toFixed(2)}`
    },
    continueShopping() {
      this.$router.push('/categories')
    },

    // Método para validar e atualizar a quantidade quando o usuário digita diretamente
    validateAndUpdateQuantity(index, item) {
      // Converter para número
      let numValue = parseInt(item.quantity)

      // Verificar se é um número válido
      if (isNaN(numValue) || numValue < 1) {
        numValue = 1
      } else if (numValue > 999) {
        // Limitar a um valor razoável para evitar problemas
        numValue = 999
      }

      // Atualizar a quantidade no carrinho
      this.cartStore.updateQuantity(index, numValue)
    }
  },
  watch: {
    notes(newValue) {
      this.checkoutStore.setOrderNotes(newValue)
    }
  }
})
</script>

<style scoped>
/* Estilo personalizado para o nome do produto com espessura extra fina */
.product-name {
  font-weight: 100 !important; /* Força a espessura mais fina possível */
  opacity: 0.7 !important; /* Reduz ainda mais a opacidade para parecer mais fino */
  letter-spacing: 0.03em !important; /* Aumenta mais o espaçamento entre letras */
  color: rgba(0, 0, 0, 0.6) !important; /* Cor mais clara para parecer mais fino */
  transform: scale(0.98, 1) !important; /* Comprime ligeiramente na horizontal */
  text-align: left !important; /* Alinha o texto à esquerda */
}

.shopping-cart-page {
  min-height: 100vh;
  background-color: white;
}

textarea::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

/* Garantir que todas as imagens tenham o mesmo tamanho */
.shopping-cart-page .cart-item-image {
  width: 80px !important;
  height: 80px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: white !important;
  overflow: hidden !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 4px !important;
}

.shopping-cart-page .cart-item-image img {
  max-width: 90% !important;
  max-height: 90% !important;
  object-fit: contain !important;
}

@media (min-width: 768px) {
  .shopping-cart-page .cart-item-image {
    width: 180px !important;
    height: 180px !important;
  }
}

/* Remove as setas do input number em todos os navegadores */
.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.quantity-input {
  -moz-appearance: textfield;
  border: none;
  outline: none;
  background: transparent;
}


</style>






















