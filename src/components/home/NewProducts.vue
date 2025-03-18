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
              @click="goToProduct(product.id)"
              class="cursor-pointer"
            >
              <div class="flex flex-col items-center h-auto md:h-[496.76px] bg-white border border-[#FAFAFA]">
                <!-- Imagem do Produto -->
                <img 
                  :src="product.image" 
                  :alt="product.name" 
                  class="w-full md:w-[307.35px] h-[200px] md:h-[281.87px] object-cover"
                >
                
                <!-- Informações do Produto -->
                <div class="flex flex-col items-center p-4 md:p-0 gap-2 md:gap-4 w-full md:w-[361.79px]">
                  <!-- Container Nome e Descrição -->
                  <div class="flex flex-col items-center">
                    <!-- Nome do Produto -->
                    <h3 class="font-archivo-narrow font-semibold text-xl md:text-[34px] leading-tight md:leading-[40px] text-black/70 text-center">
                      {{ product.name }}
                    </h3>
                    
                    <!-- Descrição do Produto -->
                    <p class="font-archivo font-medium text-base md:text-[20px] leading-normal md:leading-[22px] text-black/70 text-center">
                      {{ $t('products.description') }}
                    </p>
                  </div>
                  
                  <!-- Container Preço -->
                  <div class="flex flex-col items-center">
                    <!-- Preço -->
                    <p class="font-archivo-narrow font-semibold text-xl md:text-[34px] leading-tight md:leading-[40px] text-black text-center">
                      {{ formatPrice(product.price) }}
                    </p>
                  </div>
                </div>
                
                <!-- Quantidade e Botão Adicionar ao Carrinho -->
                <div class="flex flex-col sm:flex-row items-start gap-2 w-full p-4">
                  <!-- Select Field -->
                  <div class="w-full sm:w-[150px] h-[40px] sm:h-[73.31px]">
                    <!-- Select -->
                    <div class="flex flex-row justify-between items-center h-full px-2 md:px-4 py-2 md:py-3 gap-2 bg-white border-2 border-black">
                      <!-- Minus -->
                      <button 
                        class="w-3 h-3 md:w-4 md:h-4"
                        @click.stop="decrementQuantity(index)"
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
                        @click.stop="incrementQuantity(index)"
                      >
                        <div class="relative w-full h-full">
                          <div class="absolute left-[20.83%] right-[20.83%] top-1/2 bottom-1/2 border-[1.6px] border-[#1E1E1E]"></div>
                          <div class="absolute top-[20.83%] bottom-[20.83%] left-1/2 -translate-x-1/2 w-[1.6px] bg-[#1E1E1E]"></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- Botão ADD CART -->
                  <button class="w-full sm:flex-1 h-[40px] sm:h-[73.31px] bg-black">
                    <span class="font-archivo-narrow font-semibold text-lg md:text-[34px] leading-tight md:leading-[72px] text-[#FFDD00]">
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
  </section>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'NewProducts',
  setup() {
    const i18n = useI18n()
    return {
      t: i18n.t
    }
  },
  data() {
    return {
      currentSlide: 0,
      quantities: Array(6).fill(1),
      products: [
        {
          id: 1,
          name: this.$t('products.newProducts') + ' 1',
          price: 199.99,
          image: '/img/product1.png'
        },
        {
          id: 2,
          name: this.$t('products.newProducts') + ' 1',
          price: 199.99,
          image: '/img/product2.png'
        },
        {
          id: 3,
          name: this.$t('products.newProducts') + ' 3',
          price: 399.99,
          image: '/img/product3.png'
        },
        {
          id: 4,
          name: this.$t('products.newProducts') + ' 4',
          price: 499.99,
          image: '/img/product1.png'
        },
        {
          id: 5,
          name: this.$t('products.newProducts') + ' 5',
          price: 599.99,
          image: '/img/product2.png'
        },
        {
          id: 6,
          name: this.$t('products.newProducts') + ' 6',
          price: 699.99,
          image: '/img/product3.png'
        }
      ],
      resizeHandler: null,
      touchStartX: 0,
      touchEndX: 0
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
      if (this.$i18n.locale === 'pt') {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price);
      }

      // Para 'fr' e 'en', forçamos o formato en-US para manter o $ na frente
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol'
      }).format(price);
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
    incrementQuantity(index) {
      this.quantities[index]++
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
    goToProduct(productId) {
      this.$router.push(`/product/${productId}`)
    }
  },
  mounted() {
    this.resizeHandler = () => {
      if (this.currentSlide > this.maxSlides) {
        this.currentSlide = this.maxSlides
      }
    }
    window.addEventListener('resize', this.resizeHandler)

    const carousel = document.querySelector('.carousel-container')
    if (carousel) {
      carousel.addEventListener('touchstart', this.handleTouchStart)
      carousel.addEventListener('touchend', this.handleTouchEnd)
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
    
    const carousel = document.querySelector('.carousel-container')
    if (carousel) {
      carousel.removeEventListener('touchstart', this.handleTouchStart)
      carousel.removeEventListener('touchend', this.handleTouchEnd)
    }
  }
}
</script>