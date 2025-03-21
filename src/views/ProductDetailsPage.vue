<template>
  <div class="bg-white">
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link to="/category" class="hover:text-black">Category</router-link>
            <span>/</span>
            <span class="text-black">{{ product.name }}</span>
          </nav>
        </div>

        <!-- Product Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Left Column - Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="aspect-square bg-[#FAFAFA] flex items-center justify-center">
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
                class="aspect-square bg-[#FAFAFA] p-2 hover:opacity-80 transition-opacity"
                :class="{'border-2 border-black': selectedImage === image}"
              >
                <img :src="image" :alt="`${product.name} view ${index + 1}`" class="w-full h-full object-contain">
              </button>
            </div>
          </div>

          <!-- Right Column - Product Info -->
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="font-archivo-narrow font-semibold text-[45px] leading-[52px] text-black/70">
                {{ product.name }}
              </h1>
              <p class="font-archivo text-xl text-black/70">
                {{ product.description }}
              </p>
              <!-- Preços -->
              <div class="flex items-center gap-4">
                <p class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
                  {{ product.price }}
                </p>
                <p class="font-archivo-narrow font-medium text-[28px] leading-[34px] text-[#E30505] line-through opacity-80">
                  {{ product.originalPrice }}
                </p>
              </div>
            </div>

            <!-- Options -->
            <div class="space-y-6">
              <!-- Color Selection -->
              <div class="space-y-2">
                <label class="font-archivo font-medium text-lg">{{ $t('productDetails.selectColor') }}</label>
                <div class="flex gap-4">
                  <button 
                    v-for="color in product.colors" 
                    :key="color.name"
                    @click="selectedColor = color"
                    class="w-12 h-12 rounded-full border-2"
                    :class="[
                      selectedColor === color ? 'border-black' : color.value === '#FFFFFF' ? 'border-gray-200' : 'border-transparent',
                      'hover:opacity-80 transition-opacity'
                    ]"
                    :style="{ backgroundColor: color.value }"
                  ></button>
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
            </div>

            <!-- Substituir o antigo seletor de quantidade pelo novo componente -->
            <ProductQuantitySelector 
              @add-to-cart="handleAddToCart"
              @shop-now="handleShopNow"
            />

            <!-- Additional Info -->
            <div class="space-y-4 pt-8 border-t border-black/10">
              <div class="space-y-2">
                <h3 class="font-archivo-narrow font-semibold text-xl">{{ $t('productDetails.shippingInfo') }}</h3>
                <p class="font-archivo text-black/70">{{ $t('productDetails.freeShipping') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Adicionando o ProductDescription -->
        <div class="mt-24 flex justify-center">
          <ProductDescription />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductDescription from '@/components/product/ProductDescription.vue'
import ProductQuantitySelector from '@/components/product/ProductQuantitySelector.vue'
import { PLACEHOLDER_IMAGE_BASE64 } from '@/services/categoryService'

export default {
  name: 'ProductDetailsPage',
  components: {
    ProductDescription,
    ProductQuantitySelector
  },
  data() {
    return {
      selectedImage: null,
      selectedColor: null,
      selectedSize: null,
      product: {
        id: '1',
        name: 'Product Name',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        price: 'R$ 199,99',
        originalPrice: 'R$ 299,99', // Adicionado preço original
        mainImage: '/img/product1.png',
        images: [
          '/img/product1.png',
          '/img/product2.png',
          '/img/product3.png',
          '/img/product1.png'
        ],
        colors: [
          { name: 'Black', value: '#000000' },
          { name: 'White', value: '#FFFFFF' },
          { name: 'Red', value: '#FF0000' },
          { name: 'Blue', value: '#0000FF' }
        ],
        sizes: ['P', 'M', 'G']
      },
      additionalInfo: [        
        {
          title: 'Shipping Information',
          content: 'Free shipping on orders over R$ 200,00'
        }
      ]
    }
  },
  methods: {
    handleAddToCart(quantity) {
      if (!this.selectedColor || !this.selectedSize) {
        alert(this.$t('productDetails.selectOptions'))
        return
      }
      
      const item = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        color: this.selectedColor,
        size: this.selectedSize,
        quantity: quantity,
        image: this.selectedImage || this.product.mainImage
      }
      
      console.log('Adding to cart:', item)
    },
    handleShopNow() {
      // Implementar lógica de compra imediata
      console.log('Shop now clicked')
      this.$router.push('/checkout')
    },
    handleImageError(e) {
      e.target.src = PLACEHOLDER_IMAGE_BASE64
    }
  },
  created() {
    // Aqui você pode carregar os dados do produto baseado no ID da rota
    const productId = this.$route.params.id
    console.log('Loading product:', productId)
    // Implementar chamada à API para carregar os dados do produto
  }
}
</script>
