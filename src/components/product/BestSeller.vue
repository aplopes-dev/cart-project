<template>
  <div class="flex flex-col items-center py-0 gap-4 w-full">

    <!-- Best Sellers Section -->
    <div class="flex flex-col justify-center items-start w-full">
      <div class="w-full border-b border-black/25 mb-4 md:mb-8">
        <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl lg:text-[34px] leading-[30px] md:leading-[40px] py-2 md:py-4">
          {{ $t('productDetails.bestSellers') }}
        </h2>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="w-full flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>

      <div v-else class="w-full overflow-x-auto pb-4">
        <div class="flex md:grid md:grid-cols-5 gap-3 md:gap-2 lg:gap-3 min-w-max md:min-w-0">
          <div
            v-for="product in bestSellers"
            :key="product.id"
            class="w-[250px] md:w-auto lg:w-auto flex flex-col justify-center items-center bg-white border border-[#FAFAFA]"
          >
            <!-- Área clicável para navegação -->
            <div
              class="w-full cursor-pointer"
              @click="navigateToProduct(product.id)"
            >
              <img
                :src="getProductImage(product.image, product)"
                :alt="product.name"
                class="w-[80%] max-w-[280px] h-[150px] md:h-[180px] lg:h-[200px] object-contain object-center mx-auto"
                @error="handleImageError"
              />

              <div class="flex flex-col items-center gap-2 md:gap-2 w-full p-3 md:p-3 product-content">
                <div class="flex flex-col gap-2 md:gap-2 w-full">
                  <h3 class="font-archivo-narrow font-semibold text-base md:text-base lg:text-lg leading-tight md:leading-[24px] text-black/70 text-center w-full line-clamp-1">
                    {{ product.name }}
                  </h3>
                  <p class="font-archivo font-medium text-sm md:text-sm leading-normal md:leading-[18px] text-black/70 text-center w-full description-fixed-height">
                    {{ product.description || '&nbsp;'.repeat(3) }}
                  </p>
                </div>

                <!-- Área de preço - só exibida quando os preços estão habilitados -->
                <div v-if="showPrices" class="w-full text-center mb-2 mt-1">
                  <p class="font-archivo-narrow font-semibold text-[22px] md:text-[22px] lg:text-[24px] leading-[26px] md:leading-[26px] lg:leading-[28px]">
                    {{ formatPrice(product.price) }}
                  </p>
                </div>
                <!-- Quando showPrices é false, adiciona apenas um pequeno espaçamento -->
                <div v-else class="w-full h-2 mt-3"></div>
              </div>
            </div>

            <!-- Botão Add Cart com evento de clique isolado -->
            <button
              class="w-full h-[50px] md:h-[50px] lg:h-[50px] bg-black"
              @click.stop="addToCart(product)"
            >
              <span class="font-archivo-narrow font-semibold text-[20px] md:text-[22px] lg:text-[24px] leading-[50px] md:leading-[50px] lg:leading-[50px] text-[#FFDD00]">
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
      default: ''
    }
  },
  setup() {
    const i18n = useI18n()
    const cartStore = useCartStore()
    const togglesStore = useFinancialTogglesStore()
    const bestSellers = ref([])
    const showPrices = ref(true) // Controla a visibilidade dos preços
    const loading = ref(true) // Controla o estado de carregamento

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
      togglesStore,
      loading
    }
  },
  data() {
    return {
      showToast: false,
      currencySymbol: '$'
    }
  },
  async created() {
    // O método loadBestSellers será chamado pelo watcher do currentProductId
    // Não precisamos fazer nada aqui, pois o watcher tem immediate: true
    console.log('[BestSeller] Componente criado, aguardando carregamento dos produtos...')
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
      // Ativa o estado de loading
      this.loading = true

      try {
        console.log(`[BestSeller] Carregando produtos mais vendidos (produto atual: ${this.currentProductId})...`)
        const { locale } = useI18n()

        // Adiciona um pequeno atraso para garantir que o loading seja exibido
        await new Promise(resolve => setTimeout(resolve, 300))

        // Carrega os produtos e as configurações financeiras em paralelo
        const [response, settings] = await Promise.all([
          productService.getProducts({
            limit: 10,
            sortBy: 'featured'
          }),
          settingsService.getFinancialSettings()
        ])

        console.log(`[BestSeller] Recebidos ${response.items.length} produtos da API`)

        // Verifica se temos produtos para exibir
        if (response.items && response.items.length > 0) {
          // Filtra e mapeia os produtos, garantindo que as descrições localizadas sejam definidas
          let filteredProducts = response.items;

          // Só filtra se tivermos um ID de produto válido
          if (this.currentProductId && this.currentProductId.trim() !== '') {
            console.log(`[BestSeller] Filtrando produto atual: ${this.currentProductId}`)
            filteredProducts = filteredProducts.filter(product => String(product.id) !== String(this.currentProductId));
          } else {
            console.log('[BestSeller] Nenhum produto atual para filtrar')
          }

          this.bestSellers = filteredProducts
            .slice(0, 5)
            .map(product => ({
              ...product,
              description: product[`description_${locale.value}`] || product.description_en || ''
            }))

          console.log(`[BestSeller] Processados ${this.bestSellers.length} produtos para exibição`)
          console.log('[BestSeller] Produtos filtrados:', this.bestSellers.map(p => p.name))
        } else {
          console.log('[BestSeller] Nenhum produto recebido da API')
          this.bestSellers = []
        }

        // Atualiza o símbolo da moeda
        this.currencySymbol = settings.currency_symbol

        // Atualiza a visibilidade dos preços com base no toggle master
        this.showPrices = this.togglesStore.masterToggle
        console.log('[BestSeller] Configurações financeiras atualizadas')

      } catch (error) {
        console.error('Error fetching best sellers:', error)
        this.bestSellers = []
      } finally {
        // Desativa o estado de loading quando terminar, independentemente do resultado
        this.loading = false
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
      // Usa a função utilitária do imageService para lidar com erros de imagem
      imageService.handleImageError(e)
    },
    navigateToProduct(productId, showValidation = false) {
      // Verifica se estamos navegando para um produto diferente do atual
      if (String(productId) !== this.currentProductId) {
        console.log(`[BestSeller] Navegando para o produto ${productId} a partir do produto ${this.currentProductId}`)

        // Usar replace em vez de push para evitar problemas de histórico
        this.$router.replace({
          name: 'ProductDetails',
          params: { id: productId },
          query: showValidation ? { showValidation: 'true' } : {}
        }).catch(err => {
          // Ignora erros de navegação duplicada
          if (err.name !== 'NavigationDuplicated') {
            console.error('[BestSeller] Erro na navegação:', err)
          }
        })
      } else {
        console.log(`[BestSeller] Tentativa de navegação para o mesmo produto ${productId}, ignorando`)
      }
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

/* Estilo para manter a altura fixa da descrição */
.description-fixed-height {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  @media (min-width: 768px) {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
  -webkit-box-orient: vertical;
  height: 3em; /* Altura fixa para 2 linhas na versão mobile */
  min-height: 3em;
  @media (min-width: 768px) {
    height: 3em; /* Altura fixa para 2 linhas na versão desktop */
    min-height: 3em;
  }
  line-height: 1.5em;
  overflow: hidden;
}

/* Estilo para o container de conteúdo do produto */
.product-content {
  display: flex;
  flex-direction: column;
  min-height: 150px; /* Altura mínima para garantir espaço consistente na versão mobile */
  @media (min-width: 768px) {
    min-height: 150px; /* Altura mínima reduzida para versão desktop */
  }
}
</style>




























