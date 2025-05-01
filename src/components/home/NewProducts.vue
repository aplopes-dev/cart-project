<template>
  <section class="flex flex-col items-center py-8 md:py-24 px-4 md:px-6 gap-4 md:gap-6 w-full bg-[#FAFAFA]">
    <div class="flex flex-col items-center gap-4 md:gap-6 max-w-[1346px] w-full">
      <!-- Título -->
      <h2 class="w-full text-xl sm:text-2xl md:text-[45px] leading-normal md:leading-[72px] font-semibold font-archivo-narrow text-center text-black/70">
        {{ $t('products.newProducts') }}
      </h2>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="py-16 w-full flex justify-center">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-empire-yellow border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-4 font-archivo text-black/70">{{ $t('common.loading') }}</p>
        </div>
      </div>

      <!-- Container do Carrossel -->
      <div v-else-if="products && products.length > 0" class="relative w-full carousel-container">
        <!-- Carrossel de Produtos -->
        <div class="relative w-full overflow-hidden px-4 md:px-[72px]">
          <div
            class="flex transition-transform duration-300 ease-out"
            :style="{ transform: `translateX(-${currentSlide * slideWidth}%)` }"
          >
            <!-- Cards de Produto -->
            <div
              v-for="(product, index) in products"
              :key="index"
              :class="[
                'flex-shrink-0 px-2 md:px-4 rotate-[0.21deg]',
                'w-full md:w-1/3'
              ]"
            >
              <div class="flex flex-col items-center h-auto md:h-[460px] bg-white border border-[#FAFAFA]">
                <!-- Área clicável para detalhes do produto -->
                <div
                  class="w-full cursor-pointer"
                  @click="navigateToProduct(product.id)"
                >
                  <!-- Imagem do Produto -->
                  <img
                    :src="getProductImage(product.image, product)"
                    :alt="product.name"
                    class="w-full h-[180px] md:h-[230px] object-cover object-center"
                    @error="handleImageError"
                  >

                  <!-- Informações do Produto -->
                  <div class="flex flex-col items-center p-2 md:p-0 gap-1 md:gap-2 w-full md:w-[361.79px] mt-2 md:mt-3">
                    <!-- Container Descrição e Nome (invertidos) -->
                    <div class="flex flex-col items-center space-y-1 w-full">
                      <!-- Descrição do produto em negrito (invertida com o nome) -->
                      <div class="h-[2.4em] overflow-hidden">
                        <p class="font-archivo font-bold text-sm md:text-base leading-[1.2em] text-black/90 text-center px-4 md:px-6 w-full description-fixed-height">
                          {{ product.description || '-' }}
                        </p>
                      </div>

                      <!-- Nome do produto com fonte mais leve -->
                      <h3 class="font-archivo-narrow font-light text-[12px] md:text-[14px] leading-[14px] md:leading-[16px] text-black/70 text-center product-name">
                        {{ product.name }}
                      </h3>
                    </div>

                    <!-- Container Preço (exibido apenas se o toggle master estiver habilitado) -->
                    <div v-if="showPrices" class="flex flex-col items-center mb-0.5 mt-1">
                      <p class="font-archivo-narrow font-semibold text-xl md:text-[28px] leading-tight md:leading-[34px] text-black text-center">
                        {{ formatPrice(product.price) }}
                      </p>
                    </div>
                    <!-- Quando showPrices é false, adiciona apenas um pequeno espaçamento -->
                    <div v-else class="mt-1"></div>
                  </div>
                </div>

                <!-- Quantidade e Botão Adicionar ao Carrinho (sempre exibidos, independente do toggle master) -->
                <div class="flex flex-col sm:flex-row items-start gap-2 w-full px-4 pb-2 mt-0.5 md:mt-1" @click.stop>
                  <!-- Select Field -->
                  <div class="w-full sm:w-[150px] h-[40px] sm:h-[60px]">
                    <!-- Select -->
                    <div class="flex flex-row justify-between items-center h-full px-2 md:px-4 py-2 md:py-3 gap-2 bg-white border-2 border-black">
                      <!-- Minus -->
                      <button
                        class="w-3 h-3 md:w-4 md:h-4"
                        @click="decrementQuantity(index)"
                      >
                        <div class="relative w-full h-full">
                          <div class="absolute left-[20.83%] right-[20.83%] top-1/2 bottom-1/2 border-[1.6px] border-[#1E1E1E]"></div>
                        </div>
                      </button>

                      <!-- Input para número -->
                      <input
                        type="number"
                        v-model.number="quantities[index]"
                        min="1"
                        class="font-archivo font-bold text-lg md:text-[22px] leading-tight md:leading-[22px] text-center text-[#010101] w-[40px] sm:w-[50px] h-full border-0 focus:outline-none appearance-none"
                        :aria-label="$t('cart.quantity')"
                        style="-moz-appearance: textfield;"
                      />

                      <!-- Plus -->
                      <button
                        class="w-3 h-3 md:w-4 md:h-4"
                        @click="incrementQuantity(index)"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-full h-full"
                        >
                          <path
                            d="M8 3.33337V12.6667M3.33337 8H12.6667"
                            stroke="#1E1E1E"
                            stroke-width="1.6"
                            stroke-linecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Botão ADD CART -->
                  <button
                    class="w-full sm:flex-1 h-[40px] sm:h-[60px] bg-black"
                    @click="handleAddToCart(index)"
                  >
                    <span class="font-archivo-narrow font-semibold text-lg md:text-[28px] leading-tight md:leading-[60px] text-[#FFDD00]">
                      {{ $t('cart.addToCart') }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botões de Navegação -->
        <button
          @click="prevSlide"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-[40px] h-[40px] md:w-[72px] md:h-[72px] bg-black flex items-center justify-center"
          :aria-label="$t('common.previous')"
        >
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.5 12L18 24L31.5 36" stroke="#FFDD00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <button
          @click="nextSlide"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[40px] h-[40px] md:w-[72px] md:h-[72px] bg-black flex items-center justify-center"
          :aria-label="$t('common.next')"
        >
          <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="rotate-180">
            <path d="M31.5 12L18 24L31.5 36" stroke="#FFDD00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Mensagem quando não há produtos -->
      <div v-else-if="!isLoading && (!products || products.length === 0)" class="py-16 w-full flex justify-center">
        <p class="font-archivo text-black/70 text-lg">{{ $t('products.noProductsFound') }}</p>
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
  </section>
</template>

<script>
/* eslint-disable */
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cartStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { productService } from '@/services/productService'
import { settingsService } from '@/services/settingsService'
import { ref, onMounted, watch } from 'vue'
import { productCharacteristicsService } from '@/services/productCharacteristicsService'
import { useRouter } from 'vue-router'
import { imageService } from '@/services/imageService'

export default {
  name: 'NewProducts',
  setup() {
    const i18n = useI18n()
    const { locale } = i18n // Extrair locale do i18n
    const cartStore = useCartStore()
    const togglesStore = useFinancialTogglesStore()
    const router = useRouter()
    const currencySymbol = ref('$')
    // Removendo a ref products do setup, pois já está sendo usada no data()
    const showPrices = ref(true)  // Controla a visibilidade dos preços

    // Carrega as configurações financeiras e o estado dos toggles
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
        console.log('Master toggle state:', togglesStore.masterToggle)
        console.log('Show prices:', showPrices.value)
      } catch (error) {
        console.error('Error loading financial settings:', error)
      }
    }

    // Observar mudanças no locale
    watch(() => i18n.locale.value, () => {
      // Atualizará os produtos no componente quando o locale mudar
      // A atualização será feita no método updated
    })

    onMounted(() => {
      loadFinancialSettings()
    })

    return {
      t: i18n.t,
      locale, // Expondo locale para uso nos métodos
      cartStore,
      currencySymbol,
      showPrices,  // Expondo showPrices
      router
    }
  },
  data() {
    return {
      currentSlide: 0,
      quantities: [],
      resizeHandler: null,
      touchStartX: 0,
      touchEndX: 0,
      showToast: false,
      isLoading: true, // Estado de carregamento para a seção de novos produtos
      products: [] // Array de produtos
    }
  },
  mounted() {
    // Ativar o estado de loading
    this.isLoading = true

    this.resizeHandler = () => {
      this.currentSlide = 0
    }
    window.addEventListener('resize', this.resizeHandler)
  },
  async created() {
    try {
      const { locale } = useI18n()  // Obtendo locale do composable
      const productsResponse = await productService.getProducts({
        limit: 10,
        page: 1,
        sortBy: 'featured'
      })

      this.products = productsResponse.items.map(product => ({
        ...product,
        description: product[`description_${locale.value}`] || product.description_en || ''
      }))
      this.quantities = Array(productsResponse.items.length).fill(1)

      // Não precisamos mais carregar o currencySymbol aqui, pois já é carregado no setup
    } catch (err) {
      console.error('Error fetching data:', err)
      this.products = []
    } finally {
      // Desativar o estado de loading após carregar os dados
      this.isLoading = false
    }
  },
  computed: {
    slideWidth() {
      return window.innerWidth >= 768 ? 33.333 : 100
    },
    maxSlides() {
      const itemsPerView = window.innerWidth >= 768 ? 3 : 1
      return Math.ceil(this.products.length - itemsPerView)
    }
  },
  watch: {
    // Observar mudanças nas quantidades para validação
    quantities: {
      handler(newQuantities) {
        // Validar todas as quantidades quando houver alterações
        newQuantities.forEach((_, index) => {
          this.validateQuantity(index)
        })
      },
      deep: true
    }
  },
  methods: {
    formatPrice(price) {
      return `${this.currencySymbol}${Number(price).toFixed(2)}`
    },
    nextSlide() {
      if (this.currentSlide >= this.maxSlides) {
        this.currentSlide = this.maxSlides
        setTimeout(() => {
          this.currentSlide = 0
        }, 50)
      } else {
        this.currentSlide++
      }
    },
    prevSlide() {
      if (this.currentSlide <= 0) {
        this.currentSlide = 0
        setTimeout(() => {
          this.currentSlide = this.maxSlides
        }, 50)
      } else {
        this.currentSlide--
      }
    },
    navigateToProduct(productId) {
      this.$router.push({
        name: 'ProductDetails', // Corrigido para corresponder ao nome exato da rota
        params: { id: productId }
      })
    },
    incrementQuantity(index) {
      if (!this.quantities[index]) {
        this.$set(this.quantities, index, 1)
      } else {
        this.quantities[index]++
      }
      // Validar após incremento
      this.validateQuantity(index)
    },
    decrementQuantity(index) {
      if (this.quantities[index] > 1) {
        this.quantities[index]--
      }
      // Validar após decremento
      this.validateQuantity(index)
    },
    // Validar entrada manual de quantidade
    validateQuantity(index) {
      // Converter para número
      let numValue = parseInt(this.quantities[index])

      // Verificar se é um número válido
      if (isNaN(numValue) || numValue < 1) {
        this.quantities[index] = 1
      } else {
        // Limitar a um valor razoável para evitar problemas
        if (numValue > 999) {
          this.quantities[index] = 999
        } else {
          this.quantities[index] = numValue
        }
      }
    },
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX
    },
    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].clientX
      const diff = this.touchStartX - this.touchEndX

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide()
        } else {
          this.prevSlide()
        }
      }
    },
    handleAddToCart(index) {
      const product = this.products[index]
      const quantity = this.quantities[index]

      // Verifica se o produto tem características que precisam ser selecionadas
      if (productCharacteristicsService.hasCharacteristics(product)) {
        // Se tiver características, redireciona para a página de detalhes do produto
        this.router.push({
          path: `/product/${product.id}`,
          query: { showValidation: 'true' } // Passa um parâmetro para mostrar a validação
        });
        return;
      }

      // Se não tiver características, adiciona diretamente ao carrinho
      const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      }

      this.cartStore.addItem(item)
      this.showSuccessToast()
    },
    showSuccessToast() {
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000) // Toast desaparece após 3 segundos
    },
    getProductImage(imagePath, product) {
      console.log(`[NewProducts] Obtendo imagem com caminho: ${imagePath}`);
      console.log(`[NewProducts] FoxPro code do produto: ${product?.foxpro_code}`);
      const imageUrl = imageService.getProductImageUrl(imagePath, product);
      console.log(`[NewProducts] Caminho da imagem processado: ${imageUrl}`);
      return imageUrl;
    },
    handleImageError(e) {
      // Usa a função utilitária do imageService para lidar com erros de imagem
      imageService.handleImageError(e)
    },
    // Método para atualizar as descrições dos produtos quando o idioma mudar
    updateProductDescriptions() {
      if (this.products && this.products.length > 0) {
        this.products = this.products.map(product => ({
          ...product,
          description: product[`description_${this.locale}`] || product.description_en || ''
        }))
      }
    }
  },

  beforeUnmount() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estilo para manter a altura fixa da descrição com exatamente duas linhas */
.description-fixed-height {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 2.4em !important; /* Altura fixa para exatamente 2 linhas */
  min-height: 2.4em !important;
  max-height: 2.4em !important;
  line-height: 1.2em !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  word-break: break-word;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}

/* Estilo personalizado para o nome do produto com espessura extra fina */
.product-name {
  font-weight: 100 !important; /* Força a espessura mais fina possível */
  opacity: 0.7 !important; /* Reduz ainda mais a opacidade para parecer mais fino */
  letter-spacing: 0.03em !important; /* Aumenta mais o espaçamento entre letras */
  color: rgba(0, 0, 0, 0.6) !important; /* Cor mais clara para parecer mais fino */
  transform: scale(0.98, 1) !important; /* Comprime ligeiramente na horizontal */
}

/* Remove as setas do input number em todos os navegadores */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>


































