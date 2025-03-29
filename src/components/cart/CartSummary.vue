<template>
  <div class="p-4 border border-black/25 rounded-none">
    <h2 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] mb-6">{{ $t('cart.orderSummary') }}</h2>
    <div class="space-y-4">
      <!-- Subtotal (apenas produtos) -->
      <div class="flex justify-between items-center">
        <span class="font-archivo text-base md:text-xl text-black/70">{{ $t('cart.subtotal') }}</span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ subtotal }}</span>
      </div>
      
      <!-- Frete -->
      <div class="flex justify-between items-center">
        <span class="font-archivo text-base md:text-xl text-black/70">
          {{ $t('cart.shipping') }}
          <span v-if="shipping === '0.00'" class="text-green-600 text-sm ml-2">
            ({{ $t('cart.freeShipping') }})
          </span>
        </span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ shipping }}</span>
      </div>

      <!-- Impostos -->
      <div class="flex justify-between items-center">
        <span class="font-archivo text-base md:text-xl text-black/70">{{ $t('cart.taxes') }}</span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ taxes }}</span>
      </div>

      <!-- Total (subtotal + frete + impostos) -->
      <div class="border-t border-black/25 pt-4">
        <div class="flex justify-between items-center">
          <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">{{ $t('cart.total') }}</span>
          <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ total }}</span>
        </div>
      </div>
    </div>
    <button 
      class="w-full h-[50px] md:h-[60px] bg-empire-yellow mt-6 flex justify-center items-center"
      @click="checkout"
    >
      <span class="font-archivo-narrow font-semibold text-xl md:text-2xl text-black">
        {{ $t('cart.checkout') }}
      </span>
    </button>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'CartSummary',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    subtotal: {
      type: [Number, String],
      required: true
    },
    shipping: {
      type: [Number, String],
      required: true
    },
    taxes: {
      type: [Number, String],
      required: true,
      default: '0.00'
    },
    total: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    calculatedTotal() {
      return (
        parseFloat(this.subtotal) +
        parseFloat(this.shipping) +
        parseFloat(this.taxes)
      ).toFixed(2)
    }
  },
  methods: {
    checkout() {
      this.$emit('checkout')
    }
  }
}
</script>





