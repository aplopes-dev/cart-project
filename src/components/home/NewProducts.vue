<template>
  <section class="flex flex-col items-center py-12 md:py-24 px-4 md:px-6 gap-6 w-full bg-[#FAFAFA]">
    <div class="flex flex-col items-center gap-6 max-w-[1346px] w-full">
      <!-- Título -->
      <h2 class="w-full text-2xl md:text-[45px] leading-normal md:leading-[72px] font-semibold font-archivo-narrow text-center text-black/70">
        {{ $t('products.newProducts') }}
      </h2>
      
      <!-- Container do Carrossel -->
      <div class="relative w-full carousel-container">
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
              <div class="flex flex-col items-center h-auto md:h-[496.76px] bg-white border border-[#FAFAFA]">
                <!-- Área clicável para detalhes do produto -->
                <div 
                  class="w-full cursor-pointer"
                  @click="navigateToProduct(product.id)"
                >
                  <!-- Imagem do Produto -->
                  <img 
                    :src="product.image" 
                    :alt="product.name" 
                    class="w-full md:w-[307.35px] h-[200px] md:h-[281.87px] object-cover"
                  >
                  
                  <!-- Informações do Produto -->
                  <div class="flex flex-col items-center p-4 md:p-0 gap-2 md:gap-4 w-full md:w-[361.79px]">
                    <!-- Container Nome e Descrição -->
                    <div class="flex flex-col items-center space-y-4 w-full">
                      <h3 class="font-archivo-narrow font-semibold text-lg md:text-2xl leading-tight md:leading-[32px] text-black/70 text-center">
                        {{ product.name }}
                      </h3>
                      
                      <p class="font-archivo font-medium text-sm md:text-base leading-normal md:leading-[20px] text-black/70 text-center line-clamp-2 px-4 md:px-6 w-full">
                        {{ product.description }}
                      </p>
                    </div>
                    
                    <!-- Container Preço -->
                    <div class="flex flex-col items-center mb-2">
                      <p class="font-archivo-narrow font-semibold text-xl md:text-[28px] leading-tight md:leading-[34px] text-black text-center">
                        {{ formatPrice(product.price) }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Quantidade e Botão Adicionar ao Carrinho -->
                <div class="flex flex-col sm:flex-row items-start gap-2 w-full px-4 pb-4 mt-auto" @click.stop>
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

                      <!-- Número -->
                      <span class="font-archivo font-bold text-lg md:text-[22px] leading-tight md:leading-[22px] text-center text-[#010101]">
                        {{ quantities[index] }}
                      </span>

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
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cartStore'
import { productService } from '@/services/productService'

export default {
  name: 'NewProducts',
  setup() {
    const i18n = useI18n()
    const cartStore = useCartStore()
    
    return {
      t: i18n.t,
      cartStore
    }
  },
  data() {
    return {
      currentSlide: 0,
      quantities: [],
      products: [],
      resizeHandler: null,
      touchStartX: 0,
      touchEndX: 0,
      showToast: false
    }
  },
  async created() {
    try {
      const response = await productService.getProducts({ 
        limit: 10,
        page: 1,
        sortBy: 'featured'
      })
      this.products = response.items
      this.quantities = Array(response.items.length).fill(1)
    } catch (err) {
      console.error('Error fetching products:', err)
      this.products = []
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
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol'
      }).format(price)
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
    },
    decrementQuantity(index) {
      if (this.quantities[index] > 1) {
        this.quantities[index]--
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
    }
  },
  mounted() {
    this.resizeHandler = () => {
      this.currentSlide = 0
    }
    window.addEventListener('resize', this.resizeHandler)
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
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}
</style>




















