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
                class="w-[80%] max-w-[280px] h-[200px] md:h-[280px] object-contain object-center mx-auto" 
              />
              
              <div class="flex flex-col items-center gap-4 w-full p-6">
                <div class="flex flex-col gap-2 md:gap-4 w-full">
                  <h3 class="font-archivo-narrow font-semibold text-[22px] md:text-[28px] leading-[26px] md:leading-[32px] text-black/70 text-center w-full line-clamp-1">
                    {{ product.name }}
                  </h3>
                  <p class="font-archivo font-medium text-[16px] md:text-[20px] leading-[18px] md:leading-[22px] text-black/70 text-center w-full line-clamp-2">
                    {{ product.description }}
                  </p>
                </div>

                <div class="w-full text-center mb-4">
                  <p class="font-archivo-narrow font-semibold text-[28px] md:text-[30px] leading-[32px] md:leading-[36px]">
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
import { settingsService } from '@/services/settingsService'
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
      showToast: false,
      currencySymbol: '$'
    }
  },
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  },
  async created() {
    try {
      const [response, settings] = await Promise.all([
        productService.getProducts({ 
          limit: 10,
          sortBy: 'featured'
        }),
        settingsService.getFinancialSettings()
      ])
      
      this.bestSellers = response.items
        .filter(product => String(product.id) !== String(this.currentProductId))
        .slice(0, 5)
      
      this.currencySymbol = settings.currency_symbol

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
      return `${this.currencySymbol}${Number(price).toFixed(2)}`
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



























