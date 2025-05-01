<template>
  <div class="bg-white">
    <div class="container mx-auto px-4 py-2 md:py-12">
      <!-- Loading Spinner -->
      <div v-if="loading" class="py-16 max-w-[1408px] mx-auto">
        <LoadingSpinner />
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="py-16 text-center max-w-[1408px] mx-auto">
        <p class="text-red-500 text-lg mb-4">{{ error }}</p>
        <button @click="loadProduct" class="bg-empire-yellow px-6 py-2 font-archivo-narrow font-semibold">
          {{ $t('common.retry') }}
        </button>
      </div>

      <!-- Seção principal do produto -->
      <div v-else class="max-w-[1408px] mx-auto pb-16">
        <!-- Breadcrumb -->
        <div class="mb-2 md:mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">{{ $t('breadcrumb.home') }}</router-link>
            <span>/</span>
            <router-link
              :to="`/categories/${product.category?.id}`"
              class="hover:text-black"
            >
              {{ product.category?.name ? $filters.formatCategoryName(product.category.name) : 'Loading...' }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ product.name || 'Loading...' }}</span>
          </nav>
        </div>

        <!-- Product Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          <!-- Left Column - Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="aspect-[4/3] bg-[#FAFAFA] flex items-center justify-center">
              <img
                :src="getProductImage(selectedImage || product.image)"
                :alt="product.name"
                class="max-w-full max-h-full object-contain"
                @error="handleImageError"
              >
            </div>
            <!-- Thumbnail Images -->
            <div class="grid grid-cols-4 gap-2 md:gap-4">
              <button
                v-for="(image, index) in product.images"
                :key="index"
                @click="selectedImage = image"
                class="aspect-[4/3] bg-[#FAFAFA] p-2 hover:opacity-80 transition-opacity"
                :class="{'border-2 border-black': selectedImage === image}"
              >
                <img
                  :src="getProductImage(image)"
                  :alt="`${product.name} view ${index + 1}`"
                  class="w-full h-full object-contain"
                  @error="handleImageError"
                >
              </button>
            </div>
          </div>

          <!-- Right Column - Product Info -->
          <div class="space-y-4 md:space-y-8">
            <div class="space-y-4">
              <h1 class="font-archivo-narrow font-semibold text-[28px] md:text-[45px] leading-[34px] md:leading-[52px] text-black/70">
                {{ product.name }}
              </h1>

              <!-- Preços (exibidos apenas se o toggle master estiver habilitado) -->
              <div v-if="showPrices" class="flex items-center gap-4 mb-4">
                <p class="font-archivo-narrow font-semibold text-[24px] md:text-[34px] leading-[30px] md:leading-[40px]">
                  {{ formatPrice(product.price) }}
                </p>
                <template v-if="hasDiscount">
                  <p class="font-archivo-narrow font-medium text-[20px] md:text-[34px] leading-[26px] md:leading-[40px] text-[#E30505] opacity-80 relative after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:border-t-2 after:border-[#E30505] after:border-opacity-80">
                    {{ formatPrice(calculateOriginalPrice(product.price)) }}
                  </p>
                </template>
              </div>

              <p class="font-archivo text-base md:text-xl text-black/70">
                {{ product.description }}

              </p>
              <!-- Características do Produto -->
              <div class="space-y-3 md:space-y-6">
                <!-- Cores -->
                <div v-if="product.characteristics?.COLOR?.length" class="space-y-2">
                  <label class="font-archivo font-medium text-base md:text-lg flex items-center">
                    {{ $t('productDetails.selectColor') }}
                    <span v-if="showValidationErrors && !selectedColor" class="text-red-500 ml-2">*</span>
                  </label>
                  <div class="flex flex-wrap gap-2 md:gap-4" :class="{'border-red-500 border-2 p-2 rounded': showValidationErrors && !selectedColor}">
                    <button
                      v-for="color in product.characteristics.COLOR"
                      :key="color"
                      @click="handleColorSelect(color)"
                      class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-200"
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
                  <p v-if="showValidationErrors && !selectedColor" class="text-red-500 text-sm">{{ $t('productDetails.requiredField') }}</p>
                </div>

                <!-- Tamanhos -->
                <div v-if="product.characteristics?.SIZE?.length" class="space-y-2">
                  <label class="font-archivo font-medium text-base md:text-lg flex items-center">
                    {{ $t('productDetails.selectSize') }}
                    <span v-if="showValidationErrors && !selectedSize" class="text-red-500 ml-2">*</span>
                  </label>
                  <div class="grid grid-cols-4 gap-2 md:gap-4" :class="{'border-red-500 border-2 p-2 rounded': showValidationErrors && !selectedSize}">
                    <button
                      v-for="size in product.characteristics.SIZE"
                      :key="size"
                      @click="handleSizeSelect(size)"
                      class="h-10 md:h-12 border-2 font-archivo transition-all duration-200 text-sm md:text-base"
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
                  <p v-if="showValidationErrors && !selectedSize" class="text-red-500 text-sm">{{ $t('productDetails.requiredField') }}</p>
                </div>

                <!-- Pesos -->
                <div v-if="product.characteristics?.WEIGHT?.length" class="space-y-2">
                  <label class="font-archivo font-medium text-base md:text-lg flex items-center">
                    {{ $t('productDetails.selectWeight') }}
                    <span v-if="showValidationErrors && !selectedWeight" class="text-red-500 ml-2">*</span>
                  </label>
                  <div class="grid grid-cols-4 gap-2 md:gap-4" :class="{'border-red-500 border-2 p-2 rounded': showValidationErrors && !selectedWeight}">
                    <button
                      v-for="weight in product.characteristics.WEIGHT"
                      :key="weight"
                      @click="handleWeightSelect(weight)"
                      class="h-10 md:h-12 border-2 font-archivo transition-all duration-200 text-sm md:text-base"
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
                  <p v-if="showValidationErrors && !selectedWeight" class="text-red-500 text-sm">{{ $t('productDetails.requiredField') }}</p>
                </div>
              </div>

              <!-- Mensagem de erro para características não selecionadas -->
              <div v-if="showValidationErrors" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span class="block sm:inline">{{ $t('productDetails.selectRequiredCharacteristics') }}</span>
              </div>

              <!-- Buttons Container -->
              <div class="flex flex-col space-y-2 md:space-y-4">
                <!-- Quantity Selector -->
                <ProductQuantitySelector @add-to-cart="handleAddToCart" />

                <!-- Shop Now Button -->
                <button
                  @click="handleShopNow"
                  class="w-full h-[50px] md:h-[70px] bg-empire-yellow"
                >
                  <span class="font-archivo-narrow font-semibold text-[24px] md:text-[34px] leading-[50px] md:leading-[70px] text-black">
                    {{ $t('productDetails.shopNow') }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de descrição -->
        <div class="mt-8 md:mt-12 flex flex-col items-start w-full bg-white border border-[#FAFAFA] p-4 md:p-6">
          <h2 class="w-full font-archivo-narrow font-semibold text-[24px] md:text-[36px] leading-[32px] md:leading-[56px] text-black">
            {{ $t('productDetails.description') }}
          </h2>

          <!-- Descrição técnica -->
          <div class="w-full font-archivo font-medium text-[16px] md:text-[22px] leading-[24px] md:leading-[33px] text-black/70">
            <pre v-if="hasDescription"
                 class="whitespace-pre-line font-archivo">{{ getDescription }}</pre>
            <p v-else class="font-archivo">{{ $t('productDetails.noDescription') }}</p>
          </div>
        </div>
      </div>

      <!-- Best Sellers Section -->
      <div class="mt-8 md:mt-16 w-full" style="max-width: 1408px; margin: 16px auto 0;">
        <BestSeller
          :key="'bestseller-' + String(product?.id || 'loading')"
          :current-product-id="String(product?.id || '')"
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
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
// import { PLACEHOLDER_IMAGE_PATH } from '@/services/imageConstants' // Não é mais necessário, usando imageService.handleImageError
import { productService } from '@/services/productService'
import { settingsService } from '@/services/settingsService'
import { imageService } from '@/services/imageService'
import { useCartStore } from '@/stores/cartStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import eventBus from '@/utils/eventBus'
import { formatCategoryName } from '@/filters'

export default {
  name: 'ProductDetailsPage',
  components: {
    ProductQuantitySelector,
    BestSeller,
    LoadingSpinner
  },
  setup() {
    const { locale } = useI18n()
    const route = useRoute()
    const cartStore = useCartStore()
    const togglesStore = useFinancialTogglesStore()
    const currencySymbol = ref('$')
    const discountPercentage = ref(null) // Novo ref para o percentual de desconto
    const showPrices = ref(true) // Controla a visibilidade dos preços
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
    const selectedWeight = ref(null)
    const selectedImage = ref(null)
    const showToast = ref(false)
    const showValidationErrors = ref(false)

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

        // Carrega o estado dos toggles
        togglesStore.loadTogglesFromBackend({
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
        showPrices.value = togglesStore.masterToggle
        console.log('Master toggle state:', togglesStore.masterToggle)
        console.log('Show prices:', showPrices.value)
      } catch (error) {
        console.error('Error loading financial settings:', error)
        discountPercentage.value = null
      }
    }

    const loadProduct = async () => {
      try {
        loading.value = true
        error.value = null

        // Adicionando um pequeno atraso para garantir que o loading seja exibido
        await new Promise(resolve => setTimeout(resolve, 300))

        const productId = route.params.id
        console.log(`[ProductDetailsPage] Carregando produto com ID: ${productId}`);
        await loadFinancialSettings() // Carrega as configurações financeiras
        const productData = await productService.getProductById(productId)

        console.log('[ProductDetailsPage] Dados do produto recebidos do backend:', productData);
        console.log(`[ProductDetailsPage] FoxPro Code: ${productData.foxpro_code}`);
        console.log(`[ProductDetailsPage] Imagem principal: ${productData.image}`);
        console.log(`[ProductDetailsPage] Imagens adicionais:`, productData.images);

        // Garantir que images seja um array e incluir a imagem principal (image)
        // Obter todas as imagens do produto usando o serviço de imagens
        console.log('[ProductDetailsPage] Processando imagens do produto...');
        const allImages = imageService.getProductImages(productData)
        console.log('[ProductDetailsPage] Imagens processadas:', allImages);

        product.value = {
          ...productData,
          images: allImages,
          description: productData[`description_${locale.value}`] || productData.description_en || '',
          technical_description: productData[`technical_description_${locale.value}`] || productData.technical_description_en || ''
        }

        // Resetar seleções e validações ao trocar de produto
        selectedColor.value = null
        selectedSize.value = null
        selectedWeight.value = null
        selectedImage.value = productData.image // Corrigido de mainImage para image
        console.log(`[ProductDetailsPage] Imagem selecionada inicializada: ${selectedImage.value}`);

        // Verifica se deve mostrar a validação (parâmetro da URL)
        const showValidation = route.query.showValidation === 'true'
        showValidationErrors.value = showValidation
        if (showValidation) {
          console.log('[ProductDetailsPage] Mostrando validação de características');
        }

        window.scrollTo(0, 0)

        // Se deve mostrar a validação, rola para a primeira característica
        if (showValidation) {
          setTimeout(() => {
            const firstCharacteristic = document.querySelector('.space-y-6')
            if (firstCharacteristic) {
              firstCharacteristic.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          }, 500) // Pequeno delay para garantir que o DOM foi atualizado
        }
      } catch (err) {
        console.error('Error loading product:', err)
        error.value = 'Failed to load product details'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      // Definir loading como true antes de carregar os dados
      loading.value = true
      loadProduct()

      // Adicionar listener para o evento de recarregar detalhes do produto
      eventBus.on('reload-product-details', () => {
        console.log('[ProductDetailsPage] Evento reload-product-details recebido, recarregando produto...')
        loadProduct()
      })
    })

    // Remover o listener quando o componente for desmontado
    onBeforeUnmount(() => {
      eventBus.off('reload-product-details')
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
      selectedWeight,
      selectedImage,
      showToast,
      showValidationErrors,
      cartStore,
      currencySymbol,
      discountPercentage,
      showPrices,
      loadProduct,
      formatCategoryName
    }
  },
  methods: {
    isWhiteOrLight(color) {
      if (!color || color === 'transparent') return false;

      // Cores claras conhecidas
      const lightColors = ['#ffffff', '#fff', 'white', 'branco', '#f5f5f5', '#fafafa', '#f0f0f0', '#eeeeee', '#e0e0e0', 'lightgray', 'lightgrey'];
      if (lightColors.includes(color.toLowerCase())) {
        return true;
      }

      // Tenta extrair os componentes RGB
      let r, g, b;

      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length === 3) {
          // Formato abreviado #RGB
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          // Formato completo #RRGGBB
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        }
      } else if (color.startsWith('rgb')) {
        // Formato rgb(r,g,b) ou rgba(r,g,b,a)
        const rgbValues = color.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
          [r, g, b] = rgbValues.map(Number);
        }
      }

      // Se conseguiu extrair os componentes RGB, calcula a luminosidade
      if (r !== undefined && g !== undefined && b !== undefined) {
        // Fórmula YIQ para determinar a luminosidade
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128; // Valor de corte para cores claras
      }

      // Se não conseguiu determinar, assume que não é clara
      return false;
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
      // Verificar se as características obrigatórias foram selecionadas
      if (!this.validateCharacteristics()) {
        return;
      }

      const item = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        color: this.selectedColor,
        size: this.selectedSize,
        weight: this.selectedWeight,
        quantity: quantity,
        image: this.selectedImage || this.product.image
      }

      this.cartStore.addItem(item)
      this.showSuccessToast()
    },

    validateCharacteristics() {
      this.showValidationErrors = false;
      let isValid = true;

      // Verificar se há características disponíveis e se foram selecionadas
      if (this.product.characteristics?.COLOR?.length && !this.selectedColor) {
        isValid = false;
      }

      if (this.product.characteristics?.SIZE?.length && !this.selectedSize) {
        isValid = false;
      }

      if (this.product.characteristics?.WEIGHT?.length && !this.selectedWeight) {
        isValid = false;
      }

      if (!isValid) {
        this.showValidationErrors = true;
        // Rolar para a primeira característica não selecionada
        this.$nextTick(() => {
          const firstError = document.querySelector('.border-red-500');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }

      return isValid;
    },

    // Métodos para lidar com a seleção de características
    handleColorSelect(color) {
      this.selectedColor = color;
      // Limpa a mensagem de erro quando o usuário seleciona uma característica
      if (this.showValidationErrors) {
        this.showValidationErrors = false;
      }
    },

    handleSizeSelect(size) {
      this.selectedSize = size;
      // Limpa a mensagem de erro quando o usuário seleciona uma característica
      if (this.showValidationErrors) {
        this.showValidationErrors = false;
      }
    },

    handleWeightSelect(weight) {
      this.selectedWeight = weight;
      // Limpa a mensagem de erro quando o usuário seleciona uma característica
      if (this.showValidationErrors) {
        this.showValidationErrors = false;
      }
    },
    handleShopNow() {
      // Verificar se as características obrigatórias foram selecionadas
      if (!this.validateCharacteristics()) {
        return;
      }

      // Adicionar ao carrinho primeiro
      const quantity = 1; // Quantidade padrão para compra imediata
      const item = {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        color: this.selectedColor,
        size: this.selectedSize,
        weight: this.selectedWeight,
        quantity: quantity,
        image: this.getProductImage(this.selectedImage || this.product.image),
        foxpro_code: this.product.foxpro_code
      }

      this.cartStore.addItem(item)

      // Redirecionar para o checkout
      this.$router.push('/checkout')
    },
    // eslint-disable-next-line
    getProductImage(imagePath) {
      console.log(`[ProductDetailsPage] Obtendo imagem com caminho: ${imagePath}`);
      console.log(`[ProductDetailsPage] FoxPro code do produto: ${this.product?.foxpro_code}`);
      const imageUrl = imageService.getProductImageUrl(imagePath, this.product);
      console.log(`[ProductDetailsPage] Caminho da imagem processado: ${imageUrl}`);
      return imageUrl;
    },
    handleImageError(e) {
      // Usa a função utilitária do imageService para lidar com erros de imagem
      imageService.handleImageError(e)
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








