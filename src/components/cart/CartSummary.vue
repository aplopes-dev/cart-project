<template>
  <div class="p-4 border border-black/25 rounded-none">
    <h2 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] mb-6">{{ $t('cart.orderSummary') }}</h2>
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="font-archivo text-base md:text-xl text-black/70">{{ $t('cart.subtotal') }}</span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ subtotal }}</span>
      </div>
      
      <div class="flex justify-between items-center">
        <span class="font-archivo text-base md:text-xl text-black/70">{{ $t('cart.shipping') }}</span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ shipping }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="font-archivo text-base md:text-xl text-black/70">{{ $t('cart.taxes') }}</span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ taxes }}</span>
      </div>

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
export default {
  name: 'CartSummary',
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
  methods: {
    checkout() {
      this.$emit('checkout')
    }
  }
}
</script>

