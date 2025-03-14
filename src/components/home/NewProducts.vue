<template>
  <section class="flex flex-col items-center py-24 px-6 gap-6 w-full bg-[#FAFAFA]">
    <div class="flex flex-col items-center gap-6 max-w-[1346px] w-full">
      <!-- Título -->
      <h2 class="w-full text-[45px] leading-[72px] font-semibold font-archivo-narrow text-center text-black/70">
        NEW PRODUCTS
      </h2>
      
      <!-- Container do Carrossel -->
      <div class="relative w-full carousel-container">
        <!-- Carrossel de Produtos -->
        <div class="relative w-full overflow-hidden px-[72px]">
          <div 
            class="flex transition-transform duration-300 ease-out"
            :style="{ transform: `translateX(-${currentSlide * slideWidth}%)` }"
          >
            <!-- Cards de Produto -->
            <div 
              v-for="(product, index) in products" 
              :key="index" 
              :class="[
                'flex-shrink-0 px-4 rotate-[0.21deg]',
                'w-full md:w-1/3' // Uma coluna no mobile, três no desktop
              ]"
              @click="goToProduct(product.id)"
              class="cursor-pointer"
            >
              <div class="flex flex-col items-center h-[496.76px] bg-white border border-[#FAFAFA]">
                <!-- Imagem do Produto -->
                <img :src="product.image" :alt="product.name" class="w-[307.35px] h-[281.87px] object-cover">
                
                <!-- Informações do Produto -->
                <div class="flex flex-col items-center p-0 gap-4 w-[361.79px] h-[121.94px] rotate-[0.21deg]">
                  <!-- Container Nome e Descrição -->
                  <div class="flex flex-col items-center p-0 w-[361.79px] h-[64.63px] rotate-[0.21deg]">
                    <!-- Nome do Produto -->
                    <h3 class="flex items-center justify-center w-[361.79px] h-[40px] font-archivo-narrow font-semibold text-[34px] leading-[40px] text-black/70 text-center">
                      {{ product.name }}
                    </h3>
                    
                    <!-- Descrição do Produto -->
                    <p class="flex items-center justify-center w-[361.79px] h-[22px] font-archivo font-medium text-[20px] leading-[22px] text-black/70 text-center">
                      {{ product.description }}
                    </p>
                  </div>
                  
                  <!-- Container Preço -->
                  <div class="flex flex-col items-center p-0 w-[361.79px] h-[41.31px] rotate-[0.21deg]">
                    <!-- Preço -->
                    <p class="flex items-center justify-center w-[361.79px] h-[40px] font-archivo-narrow font-semibold text-[34px] leading-[40px] text-black text-center">
                      {{ product.price }}
                    </p>
                  </div>
                </div>
                
                <!-- Quantidade e Botão Adicionar ao Carrinho -->
                <div class="flex gap-2 w-full">
                  <!-- Select Field -->
                  <div class="flex flex-col items-start p-0 gap-2 isolate w-[121.41px] h-[73.31px]">
                    <!-- Select -->
                    <div class="flex flex-row justify-between items-center px-4 py-3 gap-2 isolate w-[121.41px] h-[73.31px] bg-white border-2 border-black">
                      <!-- Minus -->
                      <button 
                        class="w-4 h-4 flex-none order-0"
                        @click="decrementQuantity(index)"
                      >
                        <div class="relative w-full h-full">
                          <div class="absolute left-[20.83%] right-[20.83%] top-1/2 bottom-1/2 border-[1.6px] border-[#1E1E1E]"></div>
                        </div>
                      </button>

                      <!-- Número -->
                      <span class="w-[27px] h-[22px] font-archivo font-bold text-[22px] leading-[22px] text-center text-[#010101]">
                        {{ quantities[index] }}
                      </span>

                      <!-- Plus -->
                      <button 
                        class="w-4 h-4 flex-none order-2"
                        @click="incrementQuantity(index)"
                      >
                        <div class="relative w-full h-full">
                          <!-- Linha horizontal -->
                          <div class="absolute left-[20.83%] right-[20.83%] top-1/2 bottom-1/2 border-[1.6px] border-[#1E1E1E]"></div>
                          <!-- Linha vertical -->
                          <div class="absolute top-[20.83%] bottom-[20.83%] left-1/2 -translate-x-1/2 w-[1.6px] bg-[#1E1E1E]"></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- Botão ADD CART permanece o mesmo -->
                  <button class="flex-1 h-[73.31px] bg-black">
                    <span class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-[#FFDD00]">ADD CART</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão de Navegação - Esquerda -->
        <button 
          @click="prevSlide"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-[72px] h-[72px] bg-black flex items-center justify-center"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.5 12L18 24L31.5 36" stroke="#FFDD00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Botão de Navegação - Direita -->
        <button 
          @click="nextSlide"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[72px] h-[72px] bg-black flex items-center justify-center"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="rotate-180">
            <path d="M31.5 12L18 24L31.5 36" stroke="#FFDD00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'NewProducts',
  data() {
    return {
      currentSlide: 0,
      quantities: Array(6).fill(1), // Array para controlar a quantidade de cada produto
      products: [
        {
          name: 'Produto 1',
          description: 'Descrição do produto 1',
          price: 'R$ 199,99',
          image: '/img/product1.png'
        },
        {
          name: 'Produto 2',
          description: 'Descrição do produto 2',
          price: 'R$ 299,99',
          image: '/img/product2.png'
        },
        {
          name: 'Produto 3',
          description: 'Descrição do produto 3',
          price: 'R$ 399,99',
          image: '/img/product3.png'
        },
        {
          name: 'Produto 4',
          description: 'Descrição do produto 4',
          price: 'R$ 499,99',
          image: '/img/product1.png'
        },
        {
          name: 'Produto 5',
          description: 'Descrição do produto 5',
          price: 'R$ 599,99',
          image: '/img/product2.png'
        },
        {
          name: 'Produto 6',
          description: 'Descrição do produto 6',
          price: 'R$ 699,99',
          image: '/img/product3.png'
        }
      ],
      resizeHandler: null,
      touchStartX: 0,
      touchEndX: 0
    }
  },
  computed: {
    // Ajustando a largura do slide para mobile
    slideWidth() {
      // No mobile, cada slide deve ocupar 100% da largura
      // No desktop, cada slide ocupa 33.333% da largura
      return window.innerWidth >= 768 ? 33.333 : 100
    },
    maxSlides() {
      const itemsPerView = window.innerWidth >= 768 ? 3 : 1
      return Math.ceil(this.products.length - itemsPerView)
    }
  },
  methods: {
    nextSlide() {
      if (this.currentSlide >= this.maxSlides) {
        // Animação suave para voltar ao início
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
        // Animação suave para ir ao final
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

      // Swipe threshold de 50px
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
      // Garantir que não ultrapasse o limite máximo ao redimensionar
      if (this.currentSlide > this.maxSlides) {
        this.currentSlide = this.maxSlides
      }
    }
    window.addEventListener('resize', this.resizeHandler)

    // Adicionar eventos de touch
    const carousel = document.querySelector('.carousel-container')
    if (carousel) {
      carousel.addEventListener('touchstart', this.handleTouchStart)
      carousel.addEventListener('touchend', this.handleTouchEnd)
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
    
    // Remover eventos de touch
    const carousel = document.querySelector('.carousel-container')
    if (carousel) {
      carousel.removeEventListener('touchstart', this.handleTouchStart)
      carousel.removeEventListener('touchend', this.handleTouchEnd)
    }
  }
}
</script>
