<template>
  <div class="flex flex-col items-center py-0 gap-4 w-full">
    
    <!-- Best Sellers Section -->
    <div class="flex flex-col justify-center items-start w-full">
      <div class="w-full border-b border-black/25 mb-8">
        <h2 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-[40px] py-4">
          {{ $t('productDetails.bestSellers') }}
        </h2>
      </div>

      <div class="w-full overflow-x-auto pb-4">
        <div class="flex md:grid md:grid-cols-5 gap-6 min-w-max md:min-w-0">
          <div 
            v-for="product in bestSellers" 
            :key="product.id" 
            class="w-[320px] md:w-auto flex flex-col justify-center items-center bg-white border border-[#FAFAFA]"
          >
            <!-- Área clicável para navegação -->
            <div 
              class="w-full cursor-pointer"
              @click="navigateToProduct(product.id)"
            >
              <img 
                :src="product.image" 
                :alt="product.name" 
                class="w-full max-w-[320px] md:max-w-[100%] h-[280px] md:h-[320px] object-cover" 
              />
              
              <div class="flex flex-col items-start gap-4 w-full p-6">
                <div class="flex flex-col gap-2 md:gap-4">
                  <h3 class="font-archivo-narrow font-semibold text-[28px] md:text-[34px] leading-[32px] md:leading-[40px] text-black/70 text-center w-full line-clamp-1">
                    {{ product.name }}
                  </h3>
                  <p class="font-archivo font-medium text-[16px] md:text-[20px] leading-[18px] md:leading-[22px] text-black/70 text-center w-full line-clamp-2">
                    {{ product.description }}
                  </p>
                </div>

                <div class="w-full text-center mb-4">
                  <p class="font-archivo-narrow font-semibold text-[28px] md:text-[34px] leading-[32px] md:leading-[40px]">
                    {{ formatPrice(product.price) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Botão Add Cart com evento de clique isolado -->
            <button 
              class="w-full h-[73.31px] bg-black"
              @click.stop="addToCart(product)"
            >
              <span class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-[#FFDD00]">
                {{ $t('productDetails.addCart') }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Message -->
  <div 
    v-if="showToast"
    class="fixed top-4 right-4 bg-black text-empire-yellow px-6 py-4 rounded-md shadow-lg z-50 transition-opacity duration-300"
    :class="{ 'opacity-0': !showToast, 'opacity-100': showToast }"
  >
    <p class="font-archivo-narrow text-lg">
      {{ $t('cart.productAdded') }}
    </p>
  </div>
</template>

<script>
import { productService } from '@/services/productService'
import eventBus from '@/utils/eventBus'
import { useCartStore } from '@/stores/cartStore'

export default {
  name: 'BestSeller',
  props: {
    currentProductId: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      bestSellers: [],
      showToast: false
    }
  },
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  },
  async created() {
    try {
      // Sempre busca mais produtos para garantir que teremos 5 após a filtragem
      const response = await productService.getProducts({ 
        limit: 10, // Aumentando o limite para ter mais produtos para filtrar
        sortBy: 'featured'
      })
      
      // Filtra o produto atual de forma mais explícita
      this.bestSellers = response.items
        .filter(product => {
          // Converte ambos para string e compara
          const productId = String(product.id)
          const currentId = String(this.currentProductId)
          return productId !== currentId
        })
        .slice(0, 5)

      console.log('Current Product ID:', this.currentProductId)
      console.log('Filtered Products:', this.bestSellers.map(p => p.id))

    } catch (error) {
      console.error('Error fetching best sellers:', error)
      this.bestSellers = []
    }
  },
  watch: {
    // Adiciona um watcher para recarregar quando currentProductId mudar
    currentProductId: {
      handler() {
        this.loadBestSellers()
      },
      immediate: true
    }
  },
  methods: {
    async loadBestSellers() {
      try {
        const response = await productService.getProducts({ 
          limit: 10,
          sortBy: 'featured'
        })
        
        this.bestSellers = response.items
          .filter(product => String(product.id) !== String(this.currentProductId))
          .slice(0, 5)

      } catch (error) {
        console.error('Error fetching best sellers:', error)
        this.bestSellers = []
      }
    },
    async navigateToProduct(productId) {
      await this.$router.push({
        name: 'ProductDetails',
        params: { id: productId }
      })
      
      eventBus.emit('reload-product-details')
    },
    formatPrice(price) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price)
    },
    addToCart(product) {
      const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }
      this.cartStore.addItem(item)
      this.showSuccessToast()
    },
    showSuccessToast() {
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    }
  }
}
</script>
<style scoped>
/* Esconde a scrollbar mas mantém a funcionalidade */
.overflow-x-auto {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>



















