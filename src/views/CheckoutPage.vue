<template>
  <div class="checkout-page">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading Spinner -->
      <div v-if="loading" class="py-16 max-w-[1408px] mx-auto">
        <LoadingSpinner />
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="py-16 text-center max-w-[1408px] mx-auto">
        <p class="text-red-500 text-lg mb-4">{{ error }}</p>
        <button @click="loadCheckoutData" class="bg-empire-yellow px-6 py-2 font-archivo-narrow font-semibold">
          {{ $t('common.retry') }}
        </button>
      </div>

      <div v-else class="max-w-[1408px] mx-auto">
        <!-- Title -->
        <div class="pb-6 text-center">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">{{ $t('checkout.title') }}</h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Personal Details Form -->
          <div class="lg:col-span-8">
            <div class="space-y-8 bg-[#FAFAFA] p-8">
              <!-- Personal Details Section -->
              <section>
                <div class="flex items-center cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('personal')">
                  <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('checkout.personalDetails') }}</h2>
                  <svg
                    class="section-arrow lg:hidden absolute right-0"
                    :class="{ 'rotate-270': sections.personal }"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z" fill="black"/>
                  </svg>
                </div>
                <div v-show="sections.personal || isDesktop" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.firstName') }}</label>
                    <input
                      type="text"
                      v-model="formData.firstName"
                      :placeholder="$t('checkout.firstNamePlaceholder')"
                      :disabled="isFieldDisabled.firstName"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base',
                        isFieldDisabled.firstName ? 'bg-gray-100' : 'bg-white',
                        (showErrors && formErrors.firstName) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.firstName" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.lastName') }}</label>
                    <input
                      type="text"
                      v-model="formData.lastName"
                      :placeholder="$t('checkout.lastNamePlaceholder')"
                      :disabled="isFieldDisabled.lastName"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base',
                        isFieldDisabled.lastName ? 'bg-gray-100' : 'bg-white',
                        (showErrors && formErrors.lastName) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.lastName" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.email') }}</label>
                    <input
                      type="email"
                      v-model="formData.email"
                      :placeholder="$t('checkout.emailPlaceholder')"
                      :disabled="isFieldDisabled.email"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base',
                        isFieldDisabled.email ? 'bg-gray-100' : 'bg-white',
                        (showErrors && formErrors.email) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.email" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.phone') }}</label>
                    <input
                      type="tel"
                      v-model="formData.phone"
                      :placeholder="$t('checkout.phonePlaceholder')"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base bg-white',
                        (showErrors && formErrors.phone) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.phone" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                </div>
              </section>

              <!-- Shipping Address Section -->
              <section>
                <div class="flex items-center justify-between cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('shipping')">
                  <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('checkout.shippingDetails') }}</h2>

                  <div class="flex items-center lg:absolute lg:right-0 lg:top-0">
                    <button
                      @click.stop
                      @click="openAddressModal"
                      class="mobile-address-btn"
                    >
                      {{ $t('checkout.changeAddress') }}
                    </button>

                    <!-- Seta para mobile -->
                    <svg
                      class="section-arrow lg:hidden ml-4 absolute right-0"
                      :class="{ 'rotate-270': sections.shipping }"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z" fill="black"/>
                    </svg>
                  </div>
                </div>
                <div v-show="sections.shipping || isDesktop" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.address') }}</label>
                    <input
                      type="text"
                      v-model="formData.address"
                      :placeholder="$t('checkout.addressPlaceholder')"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base bg-white',
                        (showErrors && formErrors.address) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.address" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>

                  <!-- Número -->
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.number') }}</label>
                    <input
                      type="text"
                      v-model="formData.number"
                      :placeholder="$t('checkout.numberPlaceholder')"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base bg-white',
                        (showErrors && formErrors.number) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.number" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>

                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.neighborhood') }}</label>
                    <input
                      type="text"
                      v-model="formData.neighborhood"
                      :placeholder="$t('checkout.neighborhoodPlaceholder')"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base bg-white',
                        (showErrors && formErrors.neighborhood) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.neighborhood" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>

                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.apartment') }}</label>
                    <input
                      type="text"
                      v-model="formData.apartment"
                      :placeholder="$t('checkout.apartmentPlaceholder')"
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.city') }}</label>
                    <input
                      type="text"
                      v-model="formData.city"
                      :placeholder="$t('checkout.cityPlaceholder')"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base bg-white',
                        (showErrors && formErrors.city) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.city" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.state') }}</label>
                    <input
                      type="text"
                      v-model="formData.state"
                      :placeholder="$t('checkout.statePlaceholder')"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base bg-white',
                        (showErrors && formErrors.state) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.state" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.postalCode') }}</label>
                    <input
                      type="text"
                      v-model="formData.postalCode"
                      :placeholder="$t('checkout.postalCodePlaceholder')"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base bg-white',
                        (showErrors && formErrors.postalCode) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.postalCode" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.country') }}</label>
                    <input
                      type="text"
                      v-model="formData.country"
                      :placeholder="$t('checkout.countryPlaceholder')"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base bg-white',
                        (showErrors && formErrors.country) ? 'border-red-500' : 'border-black/25'
                      ]"
                    >
                    <span v-if="showErrors && formErrors.country" class="text-red-500 text-sm mt-1">
                      {{ $t('checkout.fieldRequired') }}
                    </span>
                  </div>
                </div>
              </section>

              <!-- Payment Section -->
              <section>
                <div class="flex items-center cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('payment')">
                  <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('checkout.paymentDetails') }}</h2>

                  <!-- Bandeiras dos cartões -->
                  <div class="flex flex-wrap items-center gap-2 sm:gap-4 lg:ml-8">
                    <img src="/images/payment/visa.png" alt="Visa" class="h-6 sm:h-8">
                    <img src="/images/payment/master.png" alt="Mastercard" class="h-6 sm:h-8">
                    <img src="/images/payment/paypal.png" alt="PayPal" class="h-6 sm:h-8">
                    <img src="/images/payment/stripe.png" alt="Stripe" class="h-6 sm:h-8">
                    <img src="/images/payment/google.png" alt="Google Pay" class="h-6 sm:h-8">
                  </div>

                  <!-- Seta para mobile -->
                  <svg
                    class="section-arrow lg:hidden absolute right-0"
                    :class="{ 'rotate-270': sections.payment }"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.4 18L8 16.6L12.6 12L8 7.4L9.4 6L15.4 12L9.4 18Z" fill="black"/>
                  </svg>
                </div>
                <div v-show="sections.payment || isDesktop" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.cardHolder') }}</label>
                    <input
                      type="text"
                      v-model="formData.cardHolder"
                      :placeholder="$t('checkout.cardHolderPlaceholder')"
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-gray-100"
                      disabled
                    >
                  </div>
                  <div class="md:col-span-2">
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.cardNumber') }}</label>
                    <input
                      type="text"
                      v-model="formData.cardNumber"
                      :placeholder="$t('checkout.cardNumberPlaceholder')"
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-gray-100"
                      disabled
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.expiryDate') }}</label>
                    <input
                      type="text"
                      v-model="formData.expiryDate"
                      :placeholder="$t('checkout.expiryDatePlaceholder')"
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-gray-100"
                      disabled
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">{{ $t('checkout.cvv') }}</label>
                    <input
                      type="text"
                      v-model="formData.cvv"
                      :placeholder="$t('checkout.cvvPlaceholder')"
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-gray-100"
                      disabled
                    >
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-4">
            <div class="w-full lg:w-[528px] bg-white">
              <div class="flex flex-col gap-4 p-4">
                <!-- Header -->
                <div class="flex justify-center items-center w-full h-[72px] bg-[#FAFAFA]">
                  <h2 class="font-archivo-narrow font-semibold text-[34px] leading-[40px] text-center mx-auto">{{ $t('checkout.summary.title') }}</h2>
                </div>

                <!-- Loading Spinner para o resumo do pedido -->
                <div v-if="isLoadingSummary" class="py-8 flex justify-center">
                  <LoadingSpinner text="Carregando resumo..." />
                </div>

                <template v-else-if="cartItems.length > 0">
                  <!-- Products List -->
                  <div class="space-y-0">
                    <div v-for="(item, index) in cartItems" :key="index"
                      class="flex items-start py-8 border-b border-black/25">
                      <!-- Imagem do Produto -->
                      <router-link :to="`/product/${item.id}`">
                        <img
                          :src="item.image"
                          :alt="item.name"
                          class="w-[120px] h-[110px] object-cover"
                          @error="handleImageError"
                        />
                      </router-link>

                      <!-- Container para nome e preço -->
                      <div class="flex-1 min-w-0 mx-4"> <!-- min-w-0 permite que o texto seja truncado -->
                        <div class="flex flex-col gap-2">
                          <!-- Nome do Produto com Quantidade -->
                          <div class="flex items-center gap-2 min-w-0"> <!-- min-w-0 permite que o texto seja truncado -->
                            <div class="flex-shrink-0 flex justify-center items-center w-[22px] h-[22px] bg-black">
                              <span class="font-archivo font-semibold text-xs text-empire-yellow">{{ item.quantity }}x</span>
                            </div>
                            <router-link :to="`/product/${item.id}`" class="font-archivo text-[22px] leading-[40px] truncate hover:text-empire-yellow transition-colors">{{ item.name }}</router-link>
                          </div>

                          <!-- Características do produto -->
                          <div v-if="item.color || item.size || item.weight" class="flex flex-col gap-1 mt-1">
                            <span v-if="item.color" class="font-archivo text-sm text-black/70 flex items-center gap-2">
                              <span class="font-semibold">{{ $t('productDetails.selectColor') }}:</span>
                              <span class="flex items-center gap-2">
                                <span
                                  class="inline-block rounded-full border-2 transition-all duration-200"
                                  :style="{
                                    backgroundColor: item.color,
                                    borderColor: isWhiteOrLight(item.color) ? '#CCCCCC' : 'transparent',
                                    width: '14px',
                                    height: '14px'
                                  }"
                                  :class="[
                                    isWhiteOrLight(item.color) ? 'ring-1 ring-gray-200' : ''
                                  ]"
                                ></span>
                              </span>
                            </span>
                            <span v-if="item.size" class="font-archivo text-sm text-black/70">
                              <span class="font-semibold">{{ $t('productDetails.selectSize') }}:</span> {{ item.size }}
                            </span>
                            <span v-if="item.weight" class="font-archivo text-sm text-black/70">
                              <span class="font-semibold">{{ $t('productDetails.selectWeight') }}:</span> {{ item.weight }}
                            </span>
                          </div>

                          <!-- Preço (exibido apenas se o toggle master estiver habilitado) -->
                          <span v-if="showPrices" class="font-archivo text-[22px] leading-[40px] text-black/70">
                            {{ currencySymbol }}{{ (item.price * item.quantity).toFixed(2) }}
                          </span>
                        </div>
                      </div>

                      <!-- Botão de remover -->
                      <button
                        class="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-[#E30505]/10 transition-colors rounded-sm"
                        @click="removeItem(index)"
                      >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4L21.3333 8H10.6667L12 4H20Z" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M4 8H28" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M25.3333 8V26.6667C25.3333 27.0203 25.1929 27.3594 24.9428 27.6095C24.6928 27.8595 24.3536 28 24 28H8C7.64638 28 7.30724 27.8595 7.05719 27.6095C6.80714 27.3594 6.66667 27.0203 6.66667 26.6667V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M13.3333 13.3333V22.6667" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M18.6667 13.3333V22.6667" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Totals (exibidos apenas se o toggle master estiver habilitado) -->
                  <div v-if="showPrices" class="space-y-4">
                    <div class="flex justify-between">
                      <span class="font-archivo text-[22px] leading-[40px]">{{ $t('checkout.summary.taxes') }}</span>
                      <span class="font-archivo text-[22px] leading-[40px]">{{ currencySymbol }}{{ calculateTaxes }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-archivo text-[22px] leading-[40px]">
                        {{ $t('checkout.summary.shipping') }}
                        <span v-if="calculateShipping === '0.00'" class="text-green-600 text-sm ml-2">
                          ({{ $t('checkout.summary.freeShipping') }})
                        </span>
                      </span>
                      <span class="font-archivo text-[22px] leading-[40px]">{{ currencySymbol }}{{ calculateShipping }}</span>
                    </div>
                    <div class="flex justify-between items-center py-4">
                      <span class="font-archivo-narrow font-semibold text-[34px] leading-[40px] text-black/70">
                        {{ $t('checkout.summary.total') }}
                      </span>
                      <span class="font-archivo-narrow font-semibold text-[34px] leading-[40px] text-black/70">
                        {{ currencySymbol }}{{ calculateTotal }}
                      </span>
                    </div>
                  </div>

                  <!-- Mensagem de valor mínimo de compra -->
                  <div v-if="minOrderValueEnabled && !isCheckoutButtonEnabled" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    {{ minOrderValueMessage }}
                  </div>

                  <!-- Complete Purchase Button -->
                  <button
                    class="w-full py-4 font-archivo-narrow font-semibold text-[34px] leading-[72px] text-center"
                    :class="{
                      'bg-empire-yellow': isCheckoutButtonEnabled,
                      'bg-gray-300 cursor-not-allowed': !isCheckoutButtonEnabled
                    }"
                    @click="completePurchase"
                    :disabled="!isCheckoutButtonEnabled"
                  >
                    {{ $t('checkout.completePurchase') }}
                  </button>
                </template>

                <template v-else>
                  <div class="flex flex-col items-center gap-6 py-8">
                    <p class="font-archivo-narrow font-semibold text-2xl text-center">{{ $t('checkout.emptyCart') }}</p>
                    <button
                      class="bg-empire-yellow px-8 py-4 font-archivo-narrow font-semibold text-2xl"
                      @click="continueShopping"
                    >
                      {{ $t('checkout.continueShopping') }}
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AddressSelectionModal
    :show="showAddressModal"
    :current-address-id="currentAddressId"
    @close="showAddressModal = false"
    @select="updateShippingAddress"
  />

  <!-- Modal de Confirmação de Projeto -->
  <ProjectConfirmationModal
    :show="showProjectModal"
    @close="closeProjectModal"
    @confirm="confirmProjectAndProceed"
    @change-project="handleProjectChange"
  />
</template>

<script>
import { useCartStore } from '@/stores/cartStore'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import api from '@/services/api'
import { useI18n } from 'vue-i18n'
import AddressSelectionModal from '@/components/address/AddressSelectionModal.vue'
import ProjectConfirmationModal from '@/components/checkout/ProjectConfirmationModal.vue'
import { useAddressStore } from '@/stores/addressStore'
import { settingsService } from '@/services/settingsService'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'
import { imageService } from '@/services/imageService' // Para usar o handleImageError
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'CheckoutPage',
  components: {
    AddressSelectionModal,
    ProjectConfirmationModal,
    LoadingSpinner
  },
  setup() {
    const cartStore = useCartStore()
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n()
    const addressStore = useAddressStore()
    const checkoutStore = useCheckoutStore()
    const currencySymbol = ref('$')
    const taxRate = ref(0)
    const shippingCost = ref(0)
    const freeShippingThreshold = ref(0)
    const minOrderValue = ref(0) // Valor mínimo de compra
    const minOrderValueEnabled = ref(false) // Status do toggle de valor mínimo
    const togglesStore = useFinancialTogglesStore()
    const showPrices = ref(true) // Controla a visibilidade dos preços
    const loading = ref(true) // Estado de carregamento principal
    const summaryLoading = ref(true) // Estado de carregamento do resumo
    const error = ref(null) // Estado de erro

    const loadFinancialSettings = async () => {
      try {
        const settings = await settingsService.getFinancialSettings()
        currencySymbol.value = settings.currency_symbol
        taxRate.value = parseFloat(settings.tax_rate || 0)
        shippingCost.value = parseFloat(settings.shipping_cost || 0)
        freeShippingThreshold.value = parseFloat(settings.free_shipping_threshold || 0)
        minOrderValue.value = parseFloat(settings.min_order_value || 0) // Valor mínimo de compra como número
        minOrderValueEnabled.value = settings.min_order_value_enabled || false // Status do toggle

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
        // Atualiza o status do toggle de valor mínimo
        minOrderValueEnabled.value = settings.min_order_value_enabled
        console.log('Master toggle state:', togglesStore.masterToggle)
        console.log('Show prices:', showPrices.value)
        console.log('Min order value (raw):', settings.min_order_value)
        console.log('Min order value (ref):', minOrderValue.value)
        console.log('Min order value type:', typeof minOrderValue.value)
        console.log('Min order value enabled:', minOrderValueEnabled.value)
      } catch (error) {
        console.error('Error loading financial settings:', error)
      }
    }

    // Removido onMounted aqui, pois agora está em loadCheckoutData

    const calculateTaxes = computed(() => {
      const subtotalValue = cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
      return (subtotalValue * (taxRate.value / 100)).toFixed(2)
    })

    const calculateShipping = computed(() => {
      const subtotalValue = cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)

      // Se o valor total for maior que o limite para frete grátis, retorna 0
      if (subtotalValue >= freeShippingThreshold.value) {
        return '0.00'
      }

      // Converte para número e formata com 2 casas decimais
      return Number(shippingCost.value).toFixed(2)
    })

    // Adicionar computed para dados do usuário
    const userData = computed(() => {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    })

    const cartItems = computed(() => cartStore.items)

    const continueShopping = () => {
      router.push('/categories')
    }

    const removeItem = (index) => {
      cartStore.removeItem(index)
    }

    // Variável ref para controlar o estado de loading do resumo no setup
    const isLoadingSummaryRef = ref(true)

    const loadCheckoutData = async () => {
      try {
        console.log('Iniciando carregamento de dados do checkout')
        // Definir os estados de loading como true
        loading.value = true
        summaryLoading.value = true
        isLoadingSummaryRef.value = true
        error.value = null

        // Adicionando um pequeno atraso para garantir que o loading seja exibido
        await new Promise(resolve => setTimeout(resolve, 300))

        // Carrega as configurações financeiras
        await loadFinancialSettings()

        // Carrega os endereços do usuário
        await addressStore.fetchAddresses()

        console.log('Dados básicos carregados, desativando loading principal')
        // Desativa o loading principal após carregar os dados básicos
        loading.value = false

        console.log('Desativando loading do resumo')
        // Desativa o loading do resumo imediatamente
        summaryLoading.value = false
        isLoadingSummaryRef.value = false
      } catch (err) {
        console.error('Error loading checkout data:', err)
        error.value = 'Failed to load checkout data'
        loading.value = false
        summaryLoading.value = false
        isLoadingSummaryRef.value = false
      }
    }

    // Carrega os dados ao montar o componente
    onMounted(() => {
      loadCheckoutData()
    })

    return {
      cartStore,
      store,
      router, // Importante: passar o router para os methods
      continueShopping,
      cartItems,
      removeItem,
      t,
      userData,
      addressStore,
      currencySymbol,
      calculateTaxes,
      calculateShipping,
      checkoutStore,
      showPrices,
      minOrderValue,
      minOrderValueEnabled,
      loading,
      summaryLoading,
      error,
      loadCheckoutData,
      // Expor a função loadFinancialSettings para uso nos methods
      loadFinancialSettings,
      // Expor a variável isLoadingSummaryRef para sincronização com isLoadingSummary
      isLoadingSummaryRef
    }
  },
  data() {
    // Inicializar formData com dados do usuário se disponível
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    return {
      sections: {
        personal: true,
        shipping: true,
        payment: true
      },
      isDesktop: window.innerWidth >= 1024,
      formData: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '', // Adicionar inicialização do telefone
        address: '',
        number: '', // Adicionado campo number
        neighborhood: '', // Adicionado campo neighborhood
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        cardHolder: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      },
      showErrors: false,
      /* eslint-disable vue/no-dupe-keys */
      error: null,
      showErrorAlert: false,
      /* eslint-enable vue/no-dupe-keys */
      showAddressModal: false,
      currentAddressId: null,
      showProjectModal: false,
      isLoadingSummary: true // Estado de carregamento para o resumo do pedido
    }
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    formErrors() {
      const errors = {}
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone',
        'address', 'number', 'neighborhood', 'city', 'state', 'postalCode', 'country' // Adicionado neighborhood aos campos obrigatórios
      ]

      requiredFields.forEach(field => {
        errors[field] = !this.formData[field]
      })

      return errors
    },
    hasErrors() {
      return Object.values(this.formErrors).some(error => error)
    },
    // Adicionar computed properties para verificar se campos devem estar desabilitados
    isFieldDisabled() {
      return {
        firstName: !!this.userData?.firstName,
        lastName: !!this.userData?.lastName,
        email: !!this.userData?.email
        // Não incluímos o telefone aqui para que ele permaneça editável
      }
    },
    calculateTotal() {
      const subtotalValue = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      const taxesValue = parseFloat(this.calculateTaxes)
      const shippingValue = parseFloat(this.calculateShipping)

      return (subtotalValue + taxesValue + shippingValue).toFixed(2)
    },
    // Verifica se o botão de finalizar pedido deve estar habilitado
    isCheckoutButtonEnabled() {
      // Se o toggle de valor mínimo estiver desabilitado, o botão deve estar habilitado
      if (!this.minOrderValueEnabled) {
        console.log('Min order value toggle disabled, button enabled');
        return true;
      }

      // Se o toggle estiver habilitado, verifica se o valor total é maior que o valor mínimo
      const totalValue = parseFloat(this.calculateTotal);
      const minValue = parseFloat(this.minOrderValue);

      console.log('Checkout validation:', {
        totalValue,
        minValue,
        isEnabled: totalValue >= minValue
      });

      return totalValue >= minValue;
    },
    // Mensagem de valor mínimo para exibir ao usuário
    minOrderValueMessage() {
      if (this.minOrderValueEnabled && this.minOrderValue > 0) {
        // Converter para número antes de chamar toFixed
        const minValue = parseFloat(this.minOrderValue);
        return this.$t('checkout.minOrderValueMessage', { value: `${this.currencySymbol}${minValue.toFixed(2)}` });
      }
      return '';
    }
  },
  mounted() {
    window.addEventListener('resize', this.checkDesktop)

    // Não precisamos mais definir os estados de loading aqui,
    // pois eles já são definidos no loadCheckoutData
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDesktop)
  },
  methods: {
    // Métodos para controlar os estados de loading
    setLoading(value) {
      // Atualiza diretamente a variável loading do setup se disponível
      try {
        if (this.$setup && this.$setup.loading) {
          this.$setup.loading.value = value;
        }
      } catch (err) {
        console.warn('Não foi possível acessar loading do setup:', err);
      }
    },
    setSummaryLoading(value) {
      // Atualiza diretamente a variável summaryLoading do setup se disponível
      try {
        if (this.$setup && this.$setup.summaryLoading) {
          this.$setup.summaryLoading.value = value;
        }

        // Atualiza também isLoadingSummaryRef se disponível
        if (this.$setup && this.$setup.isLoadingSummaryRef) {
          this.$setup.isLoadingSummaryRef.value = value;
        }
      } catch (err) {
        console.warn('Não foi possível acessar variáveis de loading do setup:', err);
      }

      // Atualiza diretamente a variável isLoadingSummary para garantir sincronização
      this.isLoadingSummary = value;
    },
    handleImageError(e) {
      // Usa a função utilitária do imageService para lidar com erros de imagem
      imageService.handleImageError(e)
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
    openAddressModal() {
      // Primeiro, calculamos a posição desejada
      const windowHeight = window.innerHeight;
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = scrollPosition + (windowHeight * 0.2); // 20% da altura da janela

      // Fazemos o scroll suave
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Abrimos o modal após um pequeno delay para dar tempo do scroll terminar
      setTimeout(() => {
        this.showAddressModal = true;
      }, 300);
    },
    toggleSection(section) {
      if (!this.isDesktop) {
        this.sections[section] = !this.sections[section]
      }
    },
    checkDesktop() {
      this.isDesktop = window.innerWidth >= 1024
    },
    validateForm() {
      this.showErrors = true
      return !this.hasErrors
    },
    completePurchase() {
      // Verifica se o botão está habilitado
      if (!this.isCheckoutButtonEnabled) {
        return;
      }

      if (!this.validateForm()) {
        return;
      }

      // Mostra o modal de confirmação de projeto
      this.showProjectModal = true;
    },

    closeProjectModal() {
      this.showProjectModal = false;

      // Se o modal foi fechado, verificar se há projetos disponíveis
      // Se não houver projetos, finalizar o pedido com project_id: null
      const storedProject = sessionStorage.getItem('selectedProject');
      if (!storedProject) {
        // Finalizar o pedido com project_id: null
        this.confirmProjectAndProceed({ id: null, name: null });
      }
    },

    handleProjectChange(project) {
      console.log('Projeto alterado:', project);
      // O projeto já foi salvo no localStorage pelo componente do modal
    },

    async confirmProjectAndProceed(project) {
      this.showProjectModal = false;
      console.log('Iniciando processamento do pedido');
      this.setLoading(true); // Ativar o loading global
      this.setSummaryLoading(true); // Ativar o loading do resumo
      this.error = null;

      try {
        // Sincroniza o carrinho com o backend
        await this.cartStore.syncCartWithBackend();

        // Atualiza o telefone do usuário se fornecido
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id && this.formData.phone) {
          try {
            const response = await api.patch(`/users/${user.id}`, {
              firstName: user.firstName,
              lastName: user.lastName,
              phone: this.formData.phone
            });

            // Atualiza os dados do usuário no localStorage
            localStorage.setItem('user', JSON.stringify({
              ...user,
              ...response.data
            }));
          } catch (error) {
            console.error('Error updating user phone:', error);
            // Continua com o checkout mesmo se falhar a atualização do telefone
          }
        }

        const orderData = {
          address: this.formData.address,
          number: this.formData.number,
          complement: this.formData.complement,
          neighborhood: this.formData.neighborhood,
          city: this.formData.city,
          state: this.formData.state,
          postalCode: this.formData.postalCode,
          country: this.formData.country,
          notes: this.checkoutStore.orderNotes,
          // Se o toggle master estiver desabilitado, envia valores null
          // Agora o backend foi modificado para aceitar null para esses campos
          shippingCost: this.showPrices ? parseFloat(this.calculateShipping) : null,
          taxAmount: this.showPrices ? parseFloat(this.calculateTaxes) : null,
          // Adiciona o ID do projeto selecionado (pode ser null)
          project_id: project ? project.id : null
        };

        console.log('Order data being sent:', orderData);

        const response = await api.post('/orders', orderData);

        if (response.data && response.data.order_number) {
          await this.cartStore.clearCart();
          this.checkoutStore.clearCheckoutData();

          await this.router.push({
            name: 'ThankYou',
            params: { orderNumber: response.data.order_number }
          });
        } else {
          throw new Error('Order number not received from server');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        this.error = this.$t('checkout.errorProcessingOrder');
        this.showErrorAlert = true;
      } finally {
        console.log('Finalizando processamento do pedido');
        this.setLoading(false); // Desativar o loading global
        this.setSummaryLoading(false); // Desativar o loading do resumo
        console.log('Estado final do loading do resumo:', this.isLoadingSummary);
      }
    },
    updateShippingAddress(address) {
      this.formData.address = address.address
      this.formData.number = address.number // Adicionado number
      this.formData.neighborhood = address.neighborhood // Adicionado neighborhood
      this.formData.apartment = address.apartment
      this.formData.city = address.city
      this.formData.state = address.state
      this.formData.postalCode = address.postalCode
      this.formData.country = address.country
      this.currentAddressId = address.id
    }
  },
  watch: {
    // Adicionar watcher para atualizar campos quando userData mudar
    userData: {
      handler(newUserData) {
        if (newUserData) {
          this.formData.firstName = newUserData.firstName || this.formData.firstName
          this.formData.lastName = newUserData.lastName || this.formData.lastName
          this.formData.email = newUserData.email || this.formData.email
          this.formData.phone = newUserData.phone || this.formData.phone // Adicionar atualização do telefone
        }
      },
      immediate: true
    },
    // Watcher para sincronizar isLoadingSummaryRef com isLoadingSummary
    '$setup.isLoadingSummaryRef': {
      handler(newValue) {
        console.log('isLoadingSummaryRef mudou para:', newValue)
        this.isLoadingSummary = newValue
      },
      immediate: true
    }
  },
  async beforeRouteEnter(_, __, next) {
    const cartStore = useCartStore();

    if (!cartStore.items.length) {
      next('/shopping-cart');
    } else {
      next();
    }
  },
  async created() {
    // Não carregamos os endereços aqui, pois já estão sendo carregados no loadCheckoutData
    // Apenas configuramos o endereço padrão se já estiver carregado
    try {
      const defaultAddress = this.addressStore.addresses.find(addr => addr.isDefault)

      if (defaultAddress) {
        this.formData.address = defaultAddress.address
        this.formData.number = defaultAddress.number // Adicionado number
        this.formData.neighborhood = defaultAddress.neighborhood // Adicionado neighborhood
        this.formData.apartment = defaultAddress.apartment
        this.formData.city = defaultAddress.city
        this.formData.state = defaultAddress.state
        this.formData.postalCode = defaultAddress.postalCode
        this.formData.country = defaultAddress.country
        this.currentAddressId = defaultAddress.id
      }
    } catch (error) {
      console.error('Error loading default address:', error)
      this.$toast.error(this.$t('checkout.errorLoadingAddress'))
    }
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: white;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

/* Estilização da barra de rolagem */
.overflow-y-auto {
  scrollbar-width: 8px;
  scrollbar-color: #FFDD00 #D9D9D9;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #D9D9D9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #FFDD00;
}

/* Mobile Summary */
.lg\\:hidden {
  display: none;
}

@media (max-width: 1023px) {
  .lg\\:hidden {
    display: block;
  }
}

.section-arrow {
  margin: 0 auto;
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.rotate-270 {
  transform: rotate(270deg);
}

@media (min-width: 1024px) {
  .section-arrow {
    display: none;
  }
}

@media (max-width: 1023px) {
  .mobile-address-btn {
    background-color: #FFCD29; /* empire-yellow */
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .mobile-address-btn:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

@media (min-width: 1024px) {
  .mobile-address-btn {
    background-color: #FFCD29;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
</style>
