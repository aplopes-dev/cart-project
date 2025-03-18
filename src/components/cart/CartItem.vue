<template>
  <div class="flex items-center gap-4 p-4 border rounded-lg">
    <img :src="product.image" :alt="product.name" class="w-20 h-20 object-cover rounded"/>
    <div class="flex-1">
      <h3 class="font-semibold">{{ product.name }}</h3>
      <p class="text-gray-600">{{ product.price }}</p>
    </div>
    <div class="flex items-center gap-2">
      <button 
        @click="decrease" 
        class="p-1 rounded-full hover:bg-gray-100"
        :aria-label="$t('cart.decrease')"
      >-</button>
      <span class="w-8 text-center">{{ quantity }}</span>
      <button 
        @click="increase" 
        class="p-1 rounded-full hover:bg-gray-100"
        :aria-label="$t('cart.increase')"
      >+</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartItem',
  props: {
    product: {
      type: Object,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  methods: {
    increase() {
      this.$emit('update:quantity', this.quantity + 1)
    },
    decrease() {
      if (this.quantity > 1) {
        this.$emit('update:quantity', this.quantity - 1)
      }
    }
  }
}
</script>