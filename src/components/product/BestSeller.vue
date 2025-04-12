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
                :src="getProductImage(product.image, product)"
                :alt="product.name"
                class="w-[80%] max-w-[280px] h-[200px] md:h-[280px] object-contain object-center mx-auto"
                @error="handleImageError"
              />

              <div class="flex flex-col items-center gap-4 w-full p-6">
                <div class="flex flex-col gap-2 md:gap-4 w-full">
                  <h3 class="font-archivo-narrow font-semibold text-lg md:text-2xl leading-tight md:leading-[32px] text-black/70 text-center w-full line-clamp-1">
                    {{ product.name }}
                  </h3>
                  <p class="font-archivo font-medium text-sm md:text-base leading-normal md:leading-[20px] text-black/70 text-center w-full line-clamp-2">
                    {{ product.description }}
                  </p>
                </div>

                <!-- Área de preço - só exibida quando os preços estão habilitados -->
                <div v-if="showPrices" class="w-full text-center mb-4">
                  <p class="font-archivo-narrow font-semibold text-[28px] md:text-[30px] leading-[32px] md:leading-[36px]">
                    {{ formatPrice(product.price) }}
                  </p>
                </div>
                <!-- Não adiciona espaço quando o preço não é exibido -->
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
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
// eslint-disable-next-line no-unused-vars
import { productCharacteristicsService } from '@/services/productCharacteristicsService'
import { imageService } from '@/services/imageService'

export default {
  name: 'BestSeller',
  props: {
    currentProductId: {
      type: String,
      required: false,
      default: null
    }
  },
  setup() {
    const i18n = useI18n()
    const cartStore = useCartStore()
    const togglesStore = useFinancialTogglesStore()
    const bestSellers = ref([])
    const showPrices = ref(true) // Controla a visibilidade dos preços

    // Observar mudanças no locale
    watch(() => i18n.locale.value, (newLocale) => {
      if (bestSellers.value.length) {
        bestSellers.value = bestSellers.value.map(product => ({
          ...product,
          description: product[`description_${newLocale}`] || product.description_en || ''
        }))
      }
    })

    return {
      cartStore,
      bestSellers,
      showPrices,
      togglesStore
    }
  },
  data() {
    return {
      showToast: false,
      currencySymbol: '$'
    }
  },
  async created() {
    try {
      const { locale } = useI18n()
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
        .map(product => ({
          ...product,
          description: product[`description_${locale.value}`] || product.description_en || ''
        }))

      this.currencySymbol = settings.currency_symbol

      // Carrega o estado dos toggles
      this.togglesStore.loadTogglesFromBackend({
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
      this.showPrices = this.togglesStore.masterToggle
      console.log('Master toggle state:', this.togglesStore.masterToggle)
      console.log('Show prices:', this.showPrices)

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
    getProductImage(imagePath, product) {
      console.log(`[BestSeller] Obtendo imagem com caminho: ${imagePath}`);
      console.log(`[BestSeller] FoxPro code do produto: ${product?.foxpro_code}`);
      const imageUrl = imageService.getProductImageUrl(imagePath, product);
      console.log(`[BestSeller] Caminho da imagem processado: ${imageUrl}`);
      return imageUrl;
    },
    handleImageError(e) {
      e.target.src = '/images/placeholder.png'
    },
    async navigateToProduct(productId, showValidation = false) {
      await this.$router.push({
        name: 'ProductDetails',
        params: { id: productId },
        query: showValidation ? { showValidation: 'true' } : {}
      })

      eventBus.emit('reload-product-details')
    },
    formatPrice(price) {
      return `${this.currencySymbol}${Number(price).toFixed(2)}`
    },
    addToCart(product) {
      // Verifica se o produto tem características que precisam ser selecionadas
      if (productCharacteristicsService.hasCharacteristics(product)) {
        // Se tiver características, redireciona para a página de detalhes do produto
        this.navigateToProduct(product.id, true);
        return;
      }

      // Se não tiver características, adiciona diretamente ao carrinho
      const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        foxpro_code: product.foxpro_code
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>




























