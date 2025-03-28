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
                <p v-if="hasDiscount" 
                   class="font-archivo-narrow font-medium text-[34px] leading-[40px] text-[#E30505] opacity-80 relative after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:border-t-2 after:border-[#E30505] after:border-opacity-80">
                  {{ formatPrice(originalPrice) }}
                </p>
              </div>

              <p class="font-archivo text-xl text-black/70">
                {{ product.description }}
              </p>

              <!-- Color Selection -->
              <div class="space-y-2">
                <label class="font-archivo font-medium text-lg">{{ $t('productDetails.selectColor') }}</label>
                <div class="grid grid-cols-4 gap-4">
                  <button 
                    v-for="color in product.colors" 
                    :key="color"
                    @click="selectedColor = color"
                    class="h-12 border-2"
                    :class="[
                      selectedColor === color ? 'border-black' : 'border-black/70',
                      'hover:border-black transition-colors'
                    ]"
                    :style="{ backgroundColor: color }"
                  />
                </div>
              </div>

              <!-- Size Selection -->
              <div class="space-y-2">
                <label class="font-archivo font-medium text-lg">{{ $t('productDetails.selectSize') }}</label>
                <div class="grid grid-cols-4 gap-4">
                  <button 
                    v-for="size in product.sizes" 
                    :key="size"
                    @click="selectedSize = size"
                    class="h-12 border-2"
                    :class="[
                      selectedSize === size ? 'border-black bg-black text-white' : 'border-black/70',
                      'hover:bg-black hover:text-white transition-colors'
                    ]"
                  >
                    {{ size }}
                  </button>
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
import eventBus from '@/utils/eventBus'
import { useCartStore } from '@/stores/cartStore'
import { ref, onMounted } from 'vue'

export default {
  name: 'ProductDetailsPage',
  components: {
    ProductQuantitySelector,
    BestSeller
  },
  setup() {
    const cartStore = useCartStore()
    const currencySymbol = ref('$')

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
      currencySymbol
    }
  },
  data() {
    return {
      product: {
        id: null,
        name: '',
        price: 0,
        description: '',
        technical_description: '',
        image: '',
        category: null
      },
      loading: true,
      error: null,
      selectedColor: null,
      selectedSize: null,
      selectedImage: null,
      showToast: false,
      discountPercentage: 0 // Novo campo para armazenar o desconto
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
        this.loading = true;
        this.error = null;
        const productId = this.$route.params.id;
        
        // Carrega o produto e as configurações financeiras em paralelo
        const [productData, financialSettings] = await Promise.all([
          productService.getProductById(productId),
          settingsService.getFinancialSettings()
        ]);
        
        if (!productData) {
          throw new Error('Product not found');
        }

        this.product = {
          ...productData,
          category: productData.category || null
        };
        
        // Atualiza o símbolo da moeda e o percentual de desconto
        this.currencySymbol = financialSettings.currency_symbol;
        this.discountPercentage = financialSettings.discount_percentage || 0;

        // Reseta estados importantes
        this.selectedColor = null;
        this.selectedSize = null;
        this.selectedImage = null;
        
        // Rola a página para o topo
        window.scrollTo(0, 0);
        
      } catch (err) {
        console.error('Error loading product:', err);
        this.error = 'Failed to load product details';
        this.$router.push('/404');
      } finally {
        this.loading = false;
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
        image: this.selectedImage || this.product.mainImage
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
      return this.discountPercentage > 0;
    },
    
    originalPrice() {
      if (!this.hasDiscount) return null;
      return this.calculateOriginalPrice(this.product.price);
    }
  }
}
</script>

<style scoped>
.font-archivo {
  font-family: 'Archivo', sans-serif;
}
</style>




























