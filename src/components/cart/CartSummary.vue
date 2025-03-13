<template>
  <div class="p-4 border border-black/25 rounded-none">
    <h2 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] mb-6">ORDER SUMMARY</h2>
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="font-archivo text-base md:text-xl text-black/70">Subtotal</span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ subtotal }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-archivo text-base md:text-xl text-black/70">Shipping</span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ shipping }}</span>
      </div>
      <div class="border-t border-black/25 pt-4">
        <div class="flex justify-between items-center">
          <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">TOTAL</span>
          <span class="font-archivo-narrow font-semibold text-xl md:text-2xl">${{ total }}</span>
        </div>
      </div>
    </div>
    <button 
      class="w-full h-[50px] md:h-[60px] bg-empire-yellow mt-6 flex justify-center items-center"
      @click="checkout"
    >
      <span class="font-archivo-narrow font-semibold text-xl md:text-2xl text-black">
        CHECKOUT
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CartSummary',
  props: {
    subtotal: {
      type: [String, Number],
      required: true
    },
    shipping: {
      type: [String, Number],
      required: true
    },
    total: {
      type: [String, Number],
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