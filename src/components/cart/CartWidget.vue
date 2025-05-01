<template>
  <div
    v-if="cartStore.isOpen"
    class="fixed right-0 top-0 h-screen w-full md:w-[456px] bg-white shadow-cart z-50 flex flex-col px-4 md:px-6"
  >
    <!-- Shopping Cart Section -->
    <section class="shopping-cart flex-grow overflow-y-auto">
      <div class="cart-header">
        <h1 class="text-xl md:text-[34px]">{{ $t('shoppingCart.title') }}</h1>
        <button class="close-button" @click="cartStore.closeCart()" :aria-label="$t('cart.close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="black" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <template v-if="!cartStore.items.length">
        <div class="flex flex-col items-center justify-center h-full">
          <p class="font-archivo-narrow text-base md:text-xl text-black/70 mb-6">{{ $t('cart.emptyCart') }}</p>
          <button
            class="w-full h-[45px] md:h-[60px] bg-empire-yellow font-archivo-narrow font-semibold text-lg md:text-2xl text-black"
            @click="goToCategories"
          >
            {{ $t('shoppingCart.continueShopping') }}
          </button>
        </div>
      </template>

      <template v-else>
        <div class="cart-items">
          <div v-for="(item, index) in cartStore.items" :key="index" class="cart-item">
            <router-link :to="`/product/${item.id}`">
              <img
                :src="item.image"
                :alt="item.name"
                class="item-image"
                @error="handleImageError"
              />
            </router-link>

            <div class="item-details">
              <div class="item-info">
                <!-- Descrição do produto em destaque (com máximo de 2 linhas) -->
                <div class="h-[2.2em] overflow-hidden mb-0.5">
                  <router-link :to="`/product/${item.id}`" class="hover:text-empire-yellow transition-colors">
                    <p class="font-archivo font-bold text-[12px] md:text-[14px] leading-[14px] md:leading-[18px] text-black/90 line-clamp-2">
                      {{ productDescriptions[item.id] || item.name }}
                    </p>
                  </router-link>
                </div>

                <!-- Nome do produto abaixo com fonte mais leve -->
                <h3 class="font-archivo-narrow text-[9px] md:text-[10px] leading-[11px] md:leading-[12px] line-clamp-1 truncate mb-0.5 product-name m-0 p-0"
                   style="font-weight: 100 !important; opacity: 0.7 !important; letter-spacing: 0.03em !important; color: rgba(0, 0, 0, 0.6) !important; transform: scale(0.98, 1) !important;">
                  <router-link :to="`/product/${item.id}`" class="hover:text-empire-yellow transition-colors">
                    {{ item.name }}
                  </router-link>
                </h3>

                <p v-if="showPrices" class="price">{{ formatPrice(item.price) }}</p>
                <div v-if="item.color || item.size || item.weight" class="item-characteristics">
                  <span v-if="item.color" class="characteristic">
                    {{ $t('productDetails.selectColor') }}:
                    <span class="value flex items-center gap-2">
                      <span
                        class="inline-block rounded-full border-2 transition-all duration-200"
                        :style="{
                          backgroundColor: item.color,
                          borderColor: isWhiteOrLight(item.color) ? '#CCCCCC' : 'transparent',
                          width: '16px',
                          height: '16px'
                        }"
                        :class="[
                          isWhiteOrLight(item.color) ? 'ring-1 ring-gray-200' : ''
                        ]"
                      ></span>
                    </span>
                  </span>
                  <span v-if="item.size" class="characteristic">{{ $t('productDetails.selectSize') }}: <span class="value">{{ item.size }}</span></span>
                  <span v-if="item.weight" class="characteristic">{{ $t('productDetails.selectWeight') }}: <span class="value">{{ item.weight }}</span></span>
                </div>
              </div>

              <!-- Container para o seletor de quantidade e botão de excluir -->
              <div class="flex items-center gap-4 md:gap-4 gap-2 md:mt-2 mt-1">
                <div class="quantity-selector">
                  <button class="quantity-btn minus" @click="cartStore.updateQuantity(index, item.quantity - 1)">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="3.33" y1="8" x2="12.67" y2="8" stroke="#1E1E1E" stroke-width="1.6"/>
                    </svg>
                  </button>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    min="1"
                    class="quantity-input"
                    :aria-label="$t('cart.quantity')"
                    @change="validateAndUpdateQuantity(index, item)"
                  />
                  <button class="quantity-btn plus" @click="handleIncreaseQuantity(index, item)">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="3.33" y1="8" x2="12.67" y2="8" stroke="#1E1E1E" stroke-width="1.6"/>
                      <line x1="8" y1="3.33" x2="8" y2="12.67" stroke="#1E1E1E" stroke-width="1.6"/>
                    </svg>
                  </button>
                </div>

                <button class="delete-btn" @click="cartStore.removeItem(index)">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8H28" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M25.3333 8V26.6667C25.3333 27.0203 25.1929 27.3594 24.9428 27.6095C24.6928 27.8595 24.3536 28 24 28H8C7.64638 28 7.30724 27.8595 7.05719 27.6095C6.80714 27.3594 6.66667 27.0203 6.66667 26.6667V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.6667 8V5.33333C10.6667 4.97971 10.8071 4.64057 11.0572 4.39052C11.3072 4.14048 11.6464 4 12 4H20C20.3536 4 20.6928 4.14048 20.9428 4.39052C21.1929 4.64057 21.3333 4.97971 21.3333 5.33333V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.3333 14.6667V21.3333" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.6667 14.6667V21.3333" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </section>

    <!-- Subtotal Section -->
    <div class="flex flex-col items-start w-full gap-2 mt-auto pb-4">
      <div v-if="showPrices" class="flex justify-between items-center py-2 w-full">
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl text-black/70">
          {{ $t('cart.subtotal') }}
        </span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl text-black/70">
          {{ total }}
        </span>
      </div>

      <p v-if="showPrices" class="font-archivo font-normal text-base md:text-lg text-black w-full">
        {{ $t('cart.taxesAndShipping') }}
      </p>

      <!-- Buttons Section -->
      <div v-if="cartStore.items.length" class="flex flex-col items-start w-full gap-2">
        <button
          class="flex justify-center items-center w-full h-[45px] md:h-[60px] border-2 border-black"
          @click="viewCart"
        >
          <span class="font-archivo-narrow font-semibold text-lg md:text-2xl text-black">
            {{ $t('cart.viewCart') }}
          </span>
        </button>

        <button
          class="flex justify-center items-center w-full h-[45px] md:h-[60px] bg-empire-yellow"
          @click="checkout"
        >
          <span class="font-archivo-narrow font-semibold text-lg md:text-2xl text-black">
            {{ $t('cart.checkout') }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { useCartStore } from '@/stores/cartStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { settingsService } from '@/services/settingsService'
import { productService } from '@/services/productService'
import { productCharacteristicsService } from '@/services/productCharacteristicsService'
import { useRouter } from 'vue-router'
import { PLACEHOLDER_IMAGE_PATH } from '@/services/imageConstants'

export default {
  name: 'CartWidget',
  setup() {
    const cartStore = useCartStore()
    const togglesStore = useFinancialTogglesStore()
    const router = useRouter()
    const { locale } = useI18n()
    const currencySymbol = ref('$')
    const showPrices = ref(true) // Controla a visibilidade dos preços
    const productDescriptions = ref({}) // Armazena as descrições dos produtos

    const loadCurrencySymbol = async () => {
      try {
        const settings = await settingsService.getFinancialSettings()
        currencySymbol.value = settings.currency_symbol

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
      } catch (error) {
        console.error('Error loading financial settings:', error)
      }
    }

    // Função para carregar as descrições dos produtos no carrinho
    const loadProductDescriptions = async () => {
      try {
        if (cartStore.items.length > 0) {
          for (const item of cartStore.items) {
            if (!productDescriptions.value[item.id]) {
              const productDetails = await productService.getProductDetails(item.id)
              if (productDetails) {
                // Seleciona a descrição no idioma atual ou usa fallback para inglês
                const description = productDetails[`description_${locale.value}`] ||
                                   productDetails.description_en ||
                                   productDetails.description_fr ||
                                   ''
                productDescriptions.value[item.id] = description
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading product descriptions:', error)
      }
    }

    // Observa mudanças nos itens do carrinho para carregar descrições
    const cartItemsWatcher = computed(() => cartStore.items.length)
    // Quando o número de itens muda, carrega as descrições
    watch(cartItemsWatcher, () => {
      if (cartStore.items.length > 0) {
        loadProductDescriptions()
      }
    })

    // Observa mudanças no idioma para atualizar as descrições
    watch(locale, () => {
      if (Object.keys(productDescriptions.value).length > 0) {
        loadProductDescriptions()
      }
    })

    onMounted(() => {
      loadCurrencySymbol()
      loadProductDescriptions()
    })

    return { cartStore, currencySymbol, showPrices, router, productDescriptions }
  },
  methods: {
    formatPrice(price) {
      const numPrice = Number(price)
      return `${this.currencySymbol}${numPrice.toFixed(2)}`
    },
    checkout() {
      this.cartStore.closeCart()
      this.$router.push('/checkout')
    },
    viewCart() {
      this.cartStore.closeCart()
      this.$router.push('/shopping-cart')
    },
    goToCategories() {
      this.cartStore.closeCart()
      this.$router.push('/categories')
    },
    handleImageError(e) {

      e.target.src = PLACEHOLDER_IMAGE_PATH
      e.target.onerror = null // Previne loop infinito
    },
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
    async handleIncreaseQuantity(index, item) {
      // Verifica se o produto tem características
      if (item.id) {
        try {
          // Busca os detalhes completos do produto para verificar as características
          const productDetails = await productService.getProductDetails(item.id)

          // Verifica se o produto tem características e se todas foram selecionadas
          if (productCharacteristicsService.hasCharacteristics(productDetails)) {
            // Verifica se todas as características necessárias já foram selecionadas
            const selectedCharacteristics = {
              color: item.color,
              size: item.size,
              weight: item.weight
            }

            // Se não tiver todas as características selecionadas, redireciona para a página de detalhes
            if (!productCharacteristicsService.allCharacteristicsSelected(productDetails, selectedCharacteristics)) {
              this.cartStore.closeCart() // Fecha o carrinho antes de redirecionar
              this.$router.push({
                path: `/product/${item.id}`,
                query: { showValidation: 'true' }
              })
              return
            }
          }
        } catch (error) {
          console.error('Erro ao buscar detalhes do produto:', error)
        }
      }

      // Se não tiver características ou todas já estiverem selecionadas, aumenta a quantidade normalmente
      this.cartStore.updateQuantity(index, item.quantity + 1)
    },

    // Método para validar e atualizar a quantidade quando o usuário digita diretamente
    validateAndUpdateQuantity(index, item) {
      // Converter para número
      let numValue = parseInt(item.quantity)

      // Verificar se é um número válido
      if (isNaN(numValue) || numValue < 1) {
        numValue = 1
      } else if (numValue > 999) {
        // Limitar a um valor razoável para evitar problemas
        numValue = 999
      }

      // Atualizar a quantidade no carrinho
      this.cartStore.updateQuantity(index, numValue)
    }
  },
  computed: {
    total() {
      // Usar o getter subtotal do store que já faz o cálculo correto
      return this.formatPrice(this.cartStore.subtotal)
    }
  }
}
</script>

<style scoped>
.shadow-cart {
  box-shadow: 0px -10px 25.4px -2px rgba(12, 12, 13, 0.08);
}

.shopping-cart {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - 140px);
  padding: 12px;
  background-color: white;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.cart-header h1 {
  font-family: 'Archivo Narrow';
  font-weight: 600;
  font-size: 34px;
  line-height: 40px;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.cart-items::-webkit-scrollbar {
  width: 4px;
}

.cart-items::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.cart-items::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  align-items: flex-start;
}

.item-image {
  width: 120px;
  height: 110px;
  object-fit: contain;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

@media (max-width: 768px) {
  .item-details {
    gap: 2px;
    justify-content: space-between;
  }

  .item-image {
    width: 100px;
    height: 90px;
  }
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Adiciona espaçamento entre nome e preço */
  width: 100%;
}

@media (max-width: 768px) {
  .item-info {
    gap: 4px;
  }
}

.item-info h2 {
  font-family: 'Archivo';
  font-weight: 600; /* Alterado de 400 para 600 para ficar em negrito */
  font-size: 22px;
  line-height: 28px;
}

@media (max-width: 768px) {
  .item-info h2 {
    font-size: 16px;
    line-height: 20px;
  }
}

.price {
  font-family: 'Archivo';
  font-size: 18px;
  line-height: 24px;
}

@media (max-width: 768px) {
  .price {
    font-size: 14px;
    line-height: 18px;
  }
}

.item-characteristics {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
  font-family: 'Archivo';
  font-size: 14px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.7);
}

@media (max-width: 768px) {
  .item-characteristics {
    gap: 2px;
    margin-top: 2px;
    font-size: 12px;
    line-height: 16px;
  }
}

.characteristic {
  display: flex;
  gap: 4px;
}

@media (max-width: 768px) {
  .characteristic {
    gap: 2px;
  }
}

.value {
  font-weight: 600;
  color: #000;
}

.quantity-selector {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px 4px 4px 8px;
  gap: 4px;
  isolation: isolate;
  width: 90px;
  height: 28px;
  background: #FFFFFF;
  border: 1px solid #000000;
}

.quantity-btn {
  margin: 0 auto;
  width: 14px;
  height: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn svg line {
  position: absolute;
  left: 20.83%;
  right: 20.83%;
}

.quantity-input {
  margin: 0 auto;
  width: 30px;
  height: 100%;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  text-align: center;
  color: #1E1E1E;
  border: none;
  outline: none;
  appearance: none;
  -moz-appearance: textfield;
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-selector button:hover {
  opacity: 1;
}

.quantity-selector button:focus {
  outline: none;
}

.delete-btn {
  width: 32px;
  height: 32px;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 2px;
  transition: background-color 0.2s ease;
  border: none;
}

.delete-btn:hover {
  background-color: rgba(227, 5, 5, 0.1);
}

.delete-btn svg {
  width: 32px;
  height: 32px;
}

.close-button {
  padding: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .shopping-cart {
    height: calc(100vh - 120px);
    padding: 8px;
  }

  .cart-header {
    padding: 8px 0;
  }

  .cart-item {
    grid-template-columns: auto 1fr;
    gap: 8px;
    padding: 10px 0;
    align-items: center;
  }

  .item-image {
    width: 70px;
    height: 70px;
    object-fit: contain;
  }

  .quantity-selector {
    width: 80px;
    height: 24px;
    padding: 2px;
  }

  /* Ajustes para o botão de excluir no mobile */
  .delete-btn {
    width: 24px;
    height: 24px;
  }

  .delete-btn svg {
    width: 24px;
    height: 24px;
  }

  /* Estilo personalizado para o nome do produto */
  .product-name {
    font-weight: 100 !important;
    opacity: 0.7 !important;
    letter-spacing: 0.03em !important;
    color: rgba(0, 0, 0, 0.6) !important;
    transform: scale(0.98, 1) !important;
  }
}
</style>
