<template>
  <div class="flex flex-col bg-white border border-[#FAFAFA] h-[500px]">
    <!-- Imagem do Produto -->
    <div class="relative w-full aspect-square overflow-hidden">
      <img
        :src="getProductImage(product)"
        :alt="product.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      >
      <!-- Badge de Novo, se aplicável -->
      <div
        v-if="product.isNew"
        class="absolute top-4 left-4 bg-empire-yellow px-3 py-1 rounded-full"
      >
        <span class="text-sm font-medium">{{ $t('products.new') }}</span>
      </div>
    </div>

    <!-- Informações do Produto -->
    <div class="flex flex-col p-4 flex-grow">
      <!-- Nome do Produto -->
      <h3 class="font-archivo-narrow font-semibold text-[28px] leading-[32px] text-black/70 mb-2 line-clamp-2">
        {{ product.name }}
      </h3>

      <!-- Preço (exibido apenas se o toggle master estiver habilitado) -->
      <div class="mt-auto">
        <p v-if="showPrices" class="text-2xl font-bold text-black/70 mb-4">
          {{ formatPrice(product.price) }}
        </p>
        <!-- Quando showPrices é false, não adiciona espaço -->
        <div v-else class="mt-2"></div>

        <!-- Debug info em desenvolvimento -->
        <small v-if="process.env.NODE_ENV === 'development'" class="text-xs text-gray-500">
          Symbol: {{ currencySymbol }} | Price: {{ product.price }} | Show Prices: {{ showPrices }}
        </small>

        <!-- Botão Adicionar ao Carrinho -->
        <button
          @click="addToCart"
          :class="[showPrices ? 'mt-0' : 'mt-2', 'w-full bg-empire-yellow text-black font-medium py-2 px-4 rounded hover:bg-yellow-400 transition-colors']"
        >
          {{ $t('products.addToCart') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// import { PLACEHOLDER_IMAGE_PATH } from '@/services/imageConstants' // Não é mais necessário, usando imageService.handleImageError
import { useCartStore } from '@/stores/cartStore'
// import { settingsService } from '@/services/settingsService' // Não utilizado
// eslint-disable-next-line no-unused-vars
import { productCharacteristicsService } from '@/services/productCharacteristicsService'
import { imageService } from '@/services/imageService'
import { useRouter } from 'vue-router'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { getDefaultUnit } from '@/utils/unitUtils'

export default defineComponent({
  name: 'ProductCard',
  props: {
    currencySymbol: {
      type: String,
      required: true, // Tornar obrigatório
      default: '$'
    },
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const cartStore = useCartStore()
    const togglesStore = useFinancialTogglesStore()
    const { t } = useI18n()
    const router = useRouter()
    const showPrices = ref(togglesStore.masterToggle)

    console.log('ProductCard Setup - Initial props:', {
      product: props.product,
      currencySymbol: props.currencySymbol,
      showPrices: showPrices.value
    })

    return { cartStore, t, router, showPrices, togglesStore }
  },
  methods: {
    formatPrice(price) {
      if (!price) return `${this.currencySymbol}0.00`

      console.log('🏷️ formatPrice called:', {
        price,
        currencySymbol: this.currencySymbol,
        productId: this.product.id
      })

      const numericPrice = Number(price)
      if (isNaN(numericPrice)) return `${this.currencySymbol}0.00`

      try {
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
          .format(numericPrice)
          .replace('$', this.currencySymbol)

        console.log('💰 Formatted result:', {
          original: numericPrice,
          formatted,
          currencySymbol: this.currencySymbol,
          productId: this.product.id
        })

        return formatted
      } catch (error) {
        console.error('Error formatting price:', error)
        return `${this.currencySymbol}${numericPrice.toFixed(2)}`
      }
    },
    getProductImage(product) {
      console.log(`[ProductCard] Obtendo imagem para produto: ${product.id} - ${product.name}`);
      console.log(`[ProductCard] Caminho da imagem original: ${product.image}`);
      console.log(`[ProductCard] FoxPro code: ${product.foxpro_code}`);
      const imageUrl = imageService.getProductImageUrl(product.image, product);
      console.log(`[ProductCard] Caminho da imagem processado: ${imageUrl}`);
      return imageUrl;
    },
    handleImageError(e) {
      // Usa a função utilitária do imageService para lidar com erros de imagem
      imageService.handleImageError(e)
    },
    async addToCart() {
      // Verifica se o produto tem características que precisam ser selecionadas
      if (productCharacteristicsService.hasCharacteristics(this.product)) {
        // Se tiver características, redireciona para a página de detalhes do produto
        this.router.push({
          path: `/product/${this.product.id}`,
          query: { showValidation: 'true' } // Passa um parâmetro para mostrar a validação
        });
        return;
      }

      // Se não tiver características, adiciona diretamente ao carrinho
      const item = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: 1,
        unit: getDefaultUnit(this.product.unit_of_measure),
        image: this.getProductImage(this.product),
        foxpro_code: this.product.foxpro_code
      }
      await this.cartStore.addItem(item)
    }
  },
  watch: {
    currencySymbol: {
      immediate: true,
      handler(newValue) {
        console.log('👀 Currency symbol changed:', {
          new: newValue,
          productId: this.product.id
        })
      }
    },
    'togglesStore.masterToggle': {
      immediate: true,
      handler(newValue) {
        console.log('👀 Master toggle changed:', {
          new: newValue,
          productId: this.product.id
        })
        this.showPrices = newValue
      }
    }
  },
  mounted() {
    console.log('ProductCard Mounted:', {
      productName: this.product.name,
      price: this.product.price,
      currencySymbol: this.currencySymbol,
      formattedPrice: this.formatPrice(this.product.price)
    })
  },
  computed: {
    formattedPrice() {
      const formatted = this.formatPrice(this.product.price)
      console.log('🏷️ Computed formattedPrice:', {
        originalPrice: this.product.price,
        formatted: formatted
      })
      return formatted
    }
  }
})
</script>

<style scoped>
/* Estilo personalizado para o espaçamento automático */
.mt-auto {
  margin-top: 10%;
}
</style>

