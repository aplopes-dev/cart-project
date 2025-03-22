<template>
  <div class="checkout-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto py-8">
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
                      :disabled="userData?.firstName"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base',
                        userData?.firstName ? 'bg-gray-100' : 'bg-white',
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
                      :disabled="userData?.lastName"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base',
                        userData?.lastName ? 'bg-gray-100' : 'bg-white',
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
                      :disabled="userData?.email"
                      :class="[
                        'w-full p-4 border-2 rounded font-archivo text-base',
                        userData?.email ? 'bg-gray-100' : 'bg-white',
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
                <div class="flex items-center cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('shipping')">
                  <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('checkout.shippingDetails') }}</h2>
                  <svg 
                    class="section-arrow lg:hidden absolute right-0"
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
                <div v-show="sections.payment || isDesktop">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="font-archivo-narrow font-semibold text-2xl">{{ $t('checkout.paymentDetails') }}</h2>
                    <div class="flex items-center gap-4">
                      <img src="/images/payment/visa.png" alt="Visa" class="h-8">
                      <img src="/images/payment/master.png" alt="Mastercard" class="h-8">
                      <img src="/images/payment/paypal.png" alt="PayPal" class="h-8">
                      <img src="/images/payment/stripe.png" alt="Stripe" class="h-8">
                      <img src="/images/payment/google.png" alt="Google Pay" class="h-8">
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <template v-if="cartItems.length > 0">
                  <!-- Products List -->
                  <div class="space-y-0">
                    <div v-for="(item, index) in cartItems" :key="index" 
                      class="flex items-start py-8 border-b border-black/25">
                      <!-- Imagem do Produto -->
                      <img 
                        :src="item.image" 
                        :alt="item.name" 
                        class="w-[120px] h-[110px] object-cover"
                      />
                      
                      <!-- Container para nome e preço -->
                      <div class="flex-1 min-w-0 mx-4"> <!-- min-w-0 permite que o texto seja truncado -->
                        <div class="flex flex-col gap-2">
                          <!-- Nome do Produto com Quantidade -->
                          <div class="flex items-center gap-2 min-w-0"> <!-- min-w-0 permite que o texto seja truncado -->
                            <div class="flex-shrink-0 flex justify-center items-center w-[22px] h-[22px] bg-black">
                              <span class="font-archivo font-semibold text-xs text-empire-yellow">{{ item.quantity }}x</span>
                            </div>
                            <span class="font-archivo text-[22px] leading-[40px] truncate">{{ item.name }}</span>
                          </div>
                          
                          <!-- Preço -->
                          <span class="font-archivo text-[22px] leading-[40px] text-black/70">
                            ${{ (item.price * item.quantity).toFixed(2) }}
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

                  <!-- Totals -->
                  <div class="space-y-4">
                    <div class="flex justify-between">
                      <span class="font-archivo text-[22px] leading-[40px]">{{ $t('checkout.summary.taxes') }}</span>
                      <span class="font-archivo text-[22px] leading-[40px]">$ 0.00</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-archivo text-[22px] leading-[40px]">{{ $t('checkout.summary.shipping') }}</span>
                      <span class="font-archivo text-[22px] leading-[40px]">$ 0.00</span>
                    </div>
                    <div class="flex justify-between items-center py-4">
                      <span class="font-archivo-narrow font-semibold text-[34px] leading-[40px] text-black/70">
                        {{ $t('checkout.summary.subtotal') }}
                      </span>
                      <span class="font-archivo-narrow font-semibold text-[34px] leading-[40px] text-black/70">
                        ${{ subtotal.toFixed(2) }}
                      </span>
                    </div>
                  </div>

                  <!-- Complete Purchase Button -->
                  <button 
                    class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-[34px] leading-[72px] text-center"
                    @click="completePurchase"
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
</template>

<script>
import { useCartStore } from '@/stores/cartStore'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'CheckoutPage',
  setup() {
    const cartStore = useCartStore()
    const store = useStore()
    const router = useRouter()
    const userData = JSON.parse(localStorage.getItem('user') || '{}')

    const cartItems = computed(() => cartStore.items)

    const continueShopping = () => {
      router.push('/categories')
    }

    const removeItem = (index) => {
      cartStore.removeItem(index)
    }

    return {
      cartStore,
      store,
      continueShopping,
      cartItems,
      removeItem,
      userData
    }
  },
  data() {
    return {
      sections: {
        personal: true,
        shipping: true,
        payment: true
      },
      isDesktop: window.innerWidth >= 1024,
      formData: {
        firstName: this.userData?.firstName || '',
        lastName: this.userData?.lastName || '',
        email: this.userData?.email || '',
        phone: '',
        address: '',
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
      showErrors: false
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
        'address', 'city', 'state', 'postalCode', 'country'
      ]

      requiredFields.forEach(field => {
        errors[field] = !this.formData[field]
      })

      return errors
    },
    hasErrors() {
      return Object.values(this.formErrors).some(error => error)
    }
  },
  mounted() {
    window.addEventListener('resize', this.checkDesktop)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDesktop)
  },
  methods: {
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
    async completePurchase() {
      if (!this.validateForm()) {
        return
      }
      try {
        console.log('Processing purchase...')
        await this.$router.push('/thank-you')
      } catch (error) {
        console.error('Navigation error:', error)
      }
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
</style>

















