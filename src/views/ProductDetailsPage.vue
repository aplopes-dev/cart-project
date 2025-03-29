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
                :src="selectedImage || product.image" 
                :alt="product.name"
                @error="handleImageError"
                class="max-w-full max-h-full object-contain"
              >
            </div>
            <!-- Thumbnail Images -->
            <div class="grid grid-cols-4 gap-4">
              <!-- Principal Image Thumbnail -->
              <button 
                @click="selectedImage = product.image"
                class="aspect-[4/3] bg-[#FAFAFA] p-2 hover:opacity-80 transition-opacity"
                :class="{'border-2 border-black': selectedImage === product.image}"
              >
                <img 
                  :src="product.image" 
                  :alt="`${product.name} main view`"
                  @error="handleImageError"
                  class="w-full h-full object-contain"
                >
              </button>
              <!-- Additional Images Thumbnails -->
              <button 
                v-for="(image, index) in processedImages" 
                :key="index"
                @click="selectedImage = image"
                class="aspect-[4/3] bg-[#FAFAFA] p-2 hover:opacity-80 transition-opacity"
                :class="{'border-2 border-black': selectedImage === image}"
              >
                <img 
                  :src="image" 
                  :alt="`${product.name} view ${index + 1}`"
                  @error="handleImageError"
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
                <p v-if="hasDiscount" 
                   class="font-archivo-narrow font-medium text-[34px] leading-[40px] text-[#E30505] opacity-80 relative after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:border-t-2 after:border-[#E30505] after:border-opacity-80">
                  {{ formatPrice(originalPrice) }}
                </p>
              </div>

              <!-- Descrição normal do produto -->
              <p v-if="getNormalDescription" class="font-archivo text-xl text-black/70">
                {{ getNormalDescription }}
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

        <!-- Seção de descrição técnica -->
        <div class="mt-12 flex flex-col items-start w-full bg-white border border-[#FAFAFA] p-6">
          <h2 class="w-full font-archivo-narrow font-semibold text-[36px] leading-[56px] text-black">
            {{ $t('productDetails.description') }}
          </h2>
          
          <div class="w-full font-archivo font-medium text-[22px] leading-[33px] text-black/70">
            <pre v-if="getTechnicalDescription" 
                 class="whitespace-pre-line font-archivo">{{ getTechnicalDescription }}</pre>
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
import eventBus from '@/utils/eventBus'
import { useCartStore } from '@/stores/cartStore'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ProductDetailsPage',
  components: {
    ProductQuantitySelector,
    BestSeller
  },
  setup() {
    const { locale } = useI18n()
    const cartStore = useCartStore()
    const currencySymbol = ref('$')

    // Removed unused isWhiteOrLight function

    const loadCurrencySymbol = async () => {
      try {
        const settings = await settingsService.getFinancialSettings()
        currencySymbol.value = settings.currency_symbol
      } catch (error) {
        console.error('Error loading currency symbol:', error)
      }
    }

    onMounted(() => {
      loadCurrencySymbol()
    })

    return {
      cartStore,
      currencySymbol,
      currentLocale: locale
    }
  },
  data() {
    return {
      product: {
        id: null,
        name: '',
        price: 0,
        description_en: '',
        description_pt: '',
        description_fr: '',
        technical_description_en: '',
        technical_description_pt: '',
        technical_description_fr: '',
        image: '',
        images: [],
        characteristics: null,
        category: null
      },
      loading: true,
      error: null,
      selectedColor: null,
      selectedSize: null,
      selectedWeight: null, // Adicionando selectedWeight
      selectedImage: null,
      showToast: false,
      discountPercentage: 0
    }
  },
  created() {
    this.loadProduct()
    
    // Usa o eventBus ao invés do $root
    eventBus.on('reload-product-details', this.loadProduct)
  },
  beforeUnmount() {
    // Remove o listener usando eventBus
    eventBus.off('reload-product-details', this.loadProduct)
  },
  watch: {
    // Observa mudanças no parâmetro da rota
    '$route.params.id': {
      handler(newId, oldId) {
        if (newId !== oldId) {
          this.loadProduct()
        }
      },
      immediate: true
    }
  },
  methods: {
    formatPrice(price) {
      return `${this.currencySymbol}${Number(price).toFixed(2)}`
    },

    calculateOriginalPrice(price) {
      // Calcula o preço original baseado no desconto configurado
      if (!this.discountPercentage) return price;
      return price / (1 - (this.discountPercentage / 100));
    },
    async loadProduct() {
      try {
        this.loading = true
        this.error = null
        const productId = this.$route.params.id
        
        const [productData, financialSettings] = await Promise.all([
          productService.getProductById(productId),
          settingsService.getFinancialSettings()
        ])
        
        if (!productData) {
          throw new Error('Product not found')
        }

        // Atualiza o produto
        this.product = {
          ...productData,
          description_en: productData.description_en || '',
          description_pt: productData.description_pt || '',
          description_fr: productData.description_fr || '',
          technical_description_en: productData.technical_description_en || '',
          technical_description_pt: productData.technical_description_pt || '',
          technical_description_fr: productData.technical_description_fr || '',
          category: productData.category || null
        }
        
        this.currencySymbol = financialSettings.currency_symbol

        // Reseta estados importantes
        this.selectedColor = null
        this.selectedSize = null
        this.selectedImage = null
        
        // Atualiza configurações financeiras
        this.currencySymbol = financialSettings.currency_symbol
        this.discountPercentage = financialSettings.discount_percentage || 0

        // Define a imagem inicial como a principal
        this.selectedImage = this.product.image
        
        window.scrollTo(0, 0)
        
      } catch (err) {
        console.error('Error loading product:', err)
        this.error = 'Failed to load product details'
        this.$router.push('/404')
      } finally {
        this.loading = false
      }
    },
    handleAddToCart(quantity) {
      const item = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        color: this.selectedColor,
        size: this.selectedSize,
        quantity: quantity,
        image: this.selectedImage || this.product.image
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
      e.target.onerror = null // Previne loop infinito
    },
    showSuccessToast() {
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    }
  },
  computed: {
    getNormalDescription() {
      const locale = this.currentLocale.toLowerCase()
      return this.product[`description_${locale}`] || ''
    },

    getTechnicalDescription() {
      const locale = this.currentLocale.toLowerCase()
      return this.product[`technical_description_${locale}`] || ''
    },

    hasDescription() {
      return Boolean(this.getTechnicalDescription || this.getNormalDescription)
    }
  }
}
</script>

<style scoped>
.font-archivo {
  font-family: 'Archivo', sans-serif;
}
</style>