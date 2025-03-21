<template>
  <div class="flex flex-col bg-white border border-[#FAFAFA] h-[500px]">
    <!-- Imagem do Produto -->
    <div class="relative w-full aspect-square overflow-hidden">
      <img 
        :src="product.image" 
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

      <!-- Preço -->
      <div class="mt-auto">
        <p class="text-2xl font-bold text-black/70">
          {{ formatPrice(product.price) }}
        </p>
        
        <!-- Botão Adicionar ao Carrinho -->
        <button 
          @click="addToCart"
          class="mt-4 w-full bg-empire-yellow text-black font-medium py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
        >
          {{ $t('products.addToCart') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { PLACEHOLDER_IMAGE_BASE64 } from '@/services/categoryService'

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        name: '',
        price: 0,
        image: '',
        isNew: false
      })
    }
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    },
    handleImageError(e) {
      e.target.src = PLACEHOLDER_IMAGE_BASE64
    },
    addToCart() {
      this.$emit('add-to-cart', this.product)
    }
  }
})
</script>
