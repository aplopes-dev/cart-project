<template>
  <div class="bg-white">
    <div class="container mx-auto px-4 py-12">
      <!-- Seção principal do produto -->
      <div class="max-w-[1408px] mx-auto pb-16">
        <!-- Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link 
              :to="`/categories/${product.category?.id}`" 
              class="hover:text-black"
            >
              {{ product.category?.name || 'Loading...' }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ product.name || 'Loading...' }}</span>
          </nav>
        </div>

        <!-- Product Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Left Column - Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="aspect-[4/3] bg-[#FAFAFA] flex items-center justify-center">
              <img 
                :src="selectedImage || product.mainImage" 
                :alt="product.name"
                class="max-w-full max-h-full object-contain"
              >
            </div>
            <!-- Thumbnail Images -->
            <div class="grid grid-cols-4 gap-4">
              <button 
                v-for="(image, index) in product.images" 
                :key="index"
                @click="selectedImage = image"
                class="aspect-[4/3] bg-[#FAFAFA] p-2 hover:opacity-80 transition-opacity"
                :class="{'border-2 border-black': selectedImage === image}"
              >
                <img 
                  :src="image" 
                  :alt="`${product.name} view ${index + 1}`" 
                  class="w-full h-full object-contain"
                >
              </button>
            </div>
          </div>

          <!-- Right Column - Product Info -->
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="font-archivo-narrow font-semibold text-[45px] leading-[52px] text-black/70">
                {{ product.name }}
              </h1>

              <!-- Preços -->
              <div class="flex items-center gap-4">
                <p class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
                  {{ formatPrice(product.price) }}
                </p>
                <template v-if="hasDiscount">
                  <p class="font-archivo-narrow font-medium text-[34px] leading-[40px] text-[#E30505] opacity-80 relative after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:border-t-2 after:border-[#E30505] after:border-opacity-80">
                    {{ formatPrice(calculateOriginalPrice(product.price)) }}
                  </p>
                </template>
              </div>

              <p class="font-archivo text-xl text-black/70">
                {{ product.description }}

              </p>
              <!-- Características do Produto -->
              <div class="space-y-6">
                <!-- Cores -->
                <div v-if="product.characteristics?.COLOR?.length" class="space-y-2">
                  <label class="font-archivo font-medium text-lg">{{ $t('productDetails.selectColor') }}</label>
                  <div class="flex flex-wrap gap-4">
                    <button 
                      v-for="color in product.characteristics.COLOR" 
                      :key="color"
                      @click="selectedColor = color"
                      class="w-12 h-12 rounded-full border-2 transition-all duration-200"
                      :style="{ 
                        backgroundColor: color,
                        borderColor: isWhiteOrLight(color) 
                          ? (selectedColor === color ? 'black' : '#CCCCCC')
                          : (selectedColor === color ? 'black' : 'transparent')
                      }"
                      :class="[
                        selectedColor === color ? 'border-black' : '',
                        isWhiteOrLight(color) ? 'ring-1 ring-gray-200' : ''
                      ]"
                    />
                  </div>
                </div>

                <!-- Tamanhos -->
                <div v-if="product.characteristics?.SIZE?.length" class="space-y-2">
                  <label class="font-archivo font-medium text-lg">{{ $t('productDetails.selectSize') }}</label>
                  <div class="grid grid-cols-4 gap-4">
                    <button 
                      v-for="size in product.characteristics.SIZE" 
                      :key="size"
                      @click="selectedSize = size"
                      class="h-12 border-2 font-archivo transition-all duration-200"
                      :class="[
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-black/70 hover:border-black',
                        'hover:bg-black hover:text-white'
                      ]"
                    >
                      {{ size }}
                    </button>
                  </div>
                </div>

                <!-- Pesos -->
                <div v-if="product.characteristics?.WEIGHT?.length" class="space-y-2">
                  <label class="font-archivo font-medium text-lg">{{ $t('productDetails.selectWeight') }}</label>
                  <div class="grid grid-cols-4 gap-4">
                    <button 
                      v-for="weight in product.characteristics.WEIGHT" 
                      :key="weight"
                      @click="selectedWeight = weight"
                      class="h-12 border-2 font-archivo transition-all duration-200"
                      :class="[
                        selectedWeight === weight 
                          ? 'border-black bg-black text-white' 
                          : 'border-black/70 hover:border-black',
                        'hover:bg-black hover:text-white'
                      ]"
                    >
                      {{ weight }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Buttons Container -->
              <div class="flex flex-col space-y-4">
                <!-- Quantity Selector -->
                <ProductQuantitySelector @add-to-cart="handleAddToCart" />

                <!-- Shop Now Button -->
                <button 
                  @click="handleShopNow"
                  class="w-full h-[70px] bg-empire-yellow"
                >
                  <span class="font-archivo-narrow font-semibold text-[34px] leading-[70px] text-black">
                    {{ $t('productDetails.shopNow') }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de descrição -->
        <div class="mt-12 flex flex-col items-start w-full bg-white border border-[#FAFAFA] p-6">
          <h2 class="w-full font-archivo-narrow font-semibold text-[36px] leading-[56px] text-black">
            {{ $t('productDetails.description') }}
          </h2>

          <!-- Descrição técnica -->
          <div class="w-full font-archivo font-medium text-[22px] leading-[33px] text-black/70">
            <pre v-if="hasDescription" 
                 class="whitespace-pre-line font-archivo">{{ getDescription }}</pre>
            <p v-else class="font-archivo">{{ $t('productDetails.noDescription') }}</p>
          </div>
        </div>
      </div>

      <!-- Best Sellers Section -->
      <div class="mt-16 w-full" style="max-width: 1408px; margin: 48px auto 0;">
        <BestSeller 
          :current-product-id="String(product?.id)" 
          v-if="product?.id"
        />
      </div>
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
</template>

<script>
import ProductQuantitySelector from '@/components/product/ProductQuantitySelector.vue'
import BestSeller from '@/components/product/BestSeller.vue'
import { PLACEHOLDER_IMAGE_BASE64 } from '@/services/categoryService'
import { productService } from '@/services/productService'
import { settingsService } from '@/services/settingsService'
import { useCartStore } from '@/stores/cartStore'
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default {
  name: 'ProductDetailsPage',
  components: {
    ProductQuantitySelector,
    BestSeller
  },
  setup() {
    const { locale } = useI18n()
    const route = useRoute()
    const cartStore = useCartStore()
    const currencySymbol = ref('$')
    const discountPercentage = ref(null) // Novo ref para o percentual de desconto
    const product = ref({
      id: null,
      name: '',
      price: 0,
      description: '',
      technical_description: '',
      image: '',
      category: null
    })
    const loading = ref(true)
    const error = ref(null)
    const selectedColor = ref(null)
    const selectedSize = ref(null)
    const selectedImage = ref(null)
    const showToast = ref(false)

    // Observar mudanças no locale
    watch(locale, (newLocale) => {
      if (product.value) {
        product.value = {
          ...product.value,
          description: product.value[`description_${newLocale}`] || product.value.description_en || '',
          technical_description: product.value[`technical_description_${newLocale}`] || product.value.technical_description_en || ''
        }
      }
    })

    const loadFinancialSettings = async () => {
      try {
        const settings = await settingsService.getFinancialSettings()
        currencySymbol.value = settings.currency_symbol
        discountPercentage.value = settings.discount_percentage // Carrega o percentual de desconto
      } catch (error) {
        console.error('Error loading financial settings:', error)
        discountPercentage.value = null
      }
    }

    const loadProduct = async () => {
      try {
        loading.value = true
        error.value = null
        const productId = route.params.id
        await loadFinancialSettings() // Carrega as configurações financeiras
        const productData = await productService.getProductById(productId)

        // Garantir que images seja um array e incluir a imagem principal (image)
        const allImages = [
          productData.image, // Corrigido de mainImage para image
          ...(productData.images || [])
        ].filter(Boolean) // Remove valores null/undefined

        product.value = {
          ...productData,
          images: allImages,
          description: productData[`description_${locale.value}`] || productData.description_en || '',
          technical_description: productData[`technical_description_${locale.value}`] || productData.technical_description_en || ''
        }

        selectedColor.value = null
        selectedSize.value = null
        selectedImage.value = productData.image // Corrigido de mainImage para image
        window.scrollTo(0, 0)
      } catch (err) {
        console.error('Error loading product:', err)
        error.value = 'Failed to load product details'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadFinancialSettings()
      loadProduct()
    })

    // Watch para mudanças na rota
    watch(
      () => route.params.id,
      (newId, oldId) => {
        if (newId !== oldId) {
          loadProduct()
        }
      }
    )

    return {
      product,
      loading,
      error,
      selectedColor,
      selectedSize,
      selectedImage,
      showToast,
      cartStore,
      currencySymbol,
      discountPercentage,
      loadProduct
    }
  },
  methods: {
    isWhiteOrLight(color) {
      if (color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fff' || color.toLowerCase() === 'white') {
        return true
      }
      
      let r, g, b
      if (color.startsWith('#')) {
        const hex = color.replace('#', '')
        r = parseInt(hex.substr(0, 2), 16)
        g = parseInt(hex.substr(2, 2), 16)
        b = parseInt(hex.substr(4, 2), 16)
      } else if (color.startsWith('rgb')) {
        const rgbValues = color.match(/\d+/g)
        if (rgbValues) {
          [r, g, b] = rgbValues.map(Number)
        }
      }
      
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
      return yiq >= 128
    },
    formatPrice(price) {
      return `${this.currencySymbol}${Number(price).toFixed(2)}`
    },

    calculateOriginalPrice(price) {
      // Retorna null se não houver desconto ou se for zero
      if (!this.discountPercentage || this.discountPercentage <= 0) return null
      return price / (1 - (this.discountPercentage / 100))
    },
    handleAddToCart(quantity) {
      const item = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        color: this.selectedColor,
        size: this.selectedSize,
        quantity: quantity,
        image: this.selectedImage || this.product.image // Corrigido de mainImage para image
      }
      
      this.cartStore.addItem(item)
      this.showSuccessToast()
    },
    handleShopNow() {
      // Implementar lógica de compra imediata
      console.log('Shop now clicked')
      this.$router.push('/checkout')
    },
    handleImageError(e) {
      e.target.src = PLACEHOLDER_IMAGE_BASE64
    },
    showSuccessToast() {
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    }
  },
  computed: {
    hasDescription() {
      return Boolean(this.product?.technical_description || this.product?.description)






    },
    getDescription() {
      return this.product?.technical_description || this.product?.description || ''

    },
    hasDiscount() {
      // Verifica se existe desconto E se é maior que zero
      return !!this.discountPercentage && this.discountPercentage > 0
    }
  }
}
</script>

<style scoped>
.font-archivo {
  font-family: 'Archivo', sans-serif;
}
</style>








