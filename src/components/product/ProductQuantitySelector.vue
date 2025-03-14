<template>
  <div class="flex flex-col gap-4 w-full max-w-[554px]">
    <!-- Quantidade e Botão Add Cart -->
    <div class="flex flex-row gap-4">
      <!-- Contador de Quantidade -->
      <div class="flex flex-col gap-2 flex-grow">
        <div class="flex flex-row items-center justify-between p-4 border-2 border-black">
          <button @click="decrementQuantity" class="p-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.33337 8H12.6667" stroke="#1E1E1E" stroke-width="1.6"/>
            </svg>
          </button>
          
          <span class="font-archivo font-bold text-2xl text-black">{{ quantity }}</span>
          
          <button @click="incrementQuantity" class="p-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3.33337V12.6667M3.33337 8H12.6667" stroke="#1E1E1E" stroke-width="1.6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Botão Add Cart -->
      <button 
        @click="addToCart"
        class="flex-grow bg-black text-empire-yellow font-archivo-narrow font-semibold text-[34px] h-[73px] flex items-center justify-center"
      >
        ADD CART
      </button>
    </div>

    <!-- Botão Shop Now -->
    <button 
      @click="shopNow"
      class="w-full bg-empire-yellow text-black font-archivo-narrow font-semibold text-[34px] h-[73px] flex items-center justify-center"
    >
      SHOP NOW
    </button>
  </div>
</template>

<script>
export default {
  name: 'ProductQuantitySelector',
  data() {
    return {
      quantity: 1
    }
  },
  methods: {
    incrementQuantity() {
      this.quantity++
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    addToCart() {
      this.$emit('add-to-cart', this.quantity)
    },
    shopNow() {
      this.$emit('shop-now')
    }
  }
}
</script>