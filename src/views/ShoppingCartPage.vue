<template>
  <div class="shopping-cart-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto">
        <!-- Título Principal -->
        <div class="pt-0 pb-2 md:pb-3 text-center"> <!-- Removido padding top e mantido um pequeno padding bottom -->
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">SHOPPING CART</h1>
        </div>

        <!-- Header com títulos das colunas -->
        <div class="hidden md:grid grid-cols-12 gap-4 py-6 border-b border-black/25">
          <div class="col-span-6">
            <span class="font-archivo-narrow font-semibold text-xl">PRODUCT</span>
          </div>
          <div class="col-span-3 text-center">
            <span class="font-archivo-narrow font-semibold text-xl">QUANTITY</span>
          </div>
          <div class="col-span-3 text-right">
            <span class="font-archivo-narrow font-semibold text-xl">TOTAL</span>
          </div>
        </div>

        <!-- Lista de Produtos -->
        <div class="space-y-6 py-6">
          <div v-for="(item, index) in cartItems" :key="index" 
               class="grid grid-cols-1 md:grid-cols-12 gap-4 pb-6 border-b border-black/25">
            <!-- Produto Info -->
            <div class="col-span-1 md:col-span-6">
              <div class="flex gap-4 md:gap-8">
                <img :src="item.image" :alt="item.name" class="w-[120px] h-[120px] md:w-[180px] md:h-[180px] object-cover"/>
                <div class="flex flex-col">
                  <h3 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] md:leading-[40px]">{{ item.name }}</h3>
                  <p class="font-archivo text-base md:text-xl text-black/70">{{ item.description }}</p>
                  
                  <!-- Options -->
                  <div class="mt-2 md:mt-4 space-y-1">
                    <div class="flex gap-2">
                      <span class="font-archivo text-sm">Label</span>
                      <span class="font-archivo text-sm text-black/70">Hello World</span>
                    </div>
                    <div v-for="n in 5" :key="n" class="flex gap-2">
                      <span class="font-archivo text-sm">Option {{ n }}</span>
                      <span class="font-archivo text-sm text-black/70">Option {{ n }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div class="col-span-1 md:col-span-3 flex items-start justify-center gap-4">
              <div class="flex items-center border border-black/25">
                <button @click="decreaseQuantity(index)" 
                        class="px-4 py-2 text-xl hover:bg-black/5">-</button>
                <span class="px-4 py-2 text-xl">{{ item.quantity }}</span>
                <button @click="increaseQuantity(index)" 
                        class="px-4 py-2 text-xl hover:bg-black/5">+</button>
              </div>
              
              <!-- Ícone de Lixeira -->
              <button 
                @click="removeItem(index)"
                class="w-8 h-8 flex items-center justify-center hover:bg-[#E30505]/10 transition-colors rounded-sm"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8H28" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M25.3333 8V26.6667C25.3333 27.0203 25.1929 27.3594 24.9428 27.6095C24.6928 27.8595 24.3536 28 24 28H8C7.64638 28 7.30724 27.8595 7.05719 27.6095C6.80714 27.3594 6.66667 27.0203 6.66667 26.6667V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.6667 8V5.33333C10.6667 4.97971 10.8071 4.64057 11.0572 4.39052C11.3072 4.14048 11.6464 4 12 4H20C20.3536 4 20.6928 4.14048 20.9428 4.39052C21.1929 4.64057 21.3333 4.97971 21.3333 5.33333V8" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.3333 14.6667V21.3333" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.6667 14.6667V21.3333" stroke="#E30505" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <!-- Total -->
            <div class="col-span-1 md:col-span-3 flex items-start justify-between md:justify-end">
              <span class="md:hidden font-archivo-narrow font-semibold text-xl">TOTAL</span>
              <span class="font-archivo-narrow font-semibold text-xl">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="py-6 border-b border-black/25">
          <button 
            class="font-archivo-narrow font-semibold text-xl hover:opacity-70 flex items-center gap-2"
            @click="toggleNotes"
          >
            ADD NOTES
            <svg 
              class="w-6 h-6 transition-transform" 
              :class="{ 'rotate-180': showNotes }"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Textarea para notas -->
          <div v-if="showNotes" class="mt-4">
            <textarea
              v-model="notes"
              rows="4"
              class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base resize-none focus:outline-none focus:border-black"
              placeholder="Add your notes here..."
            ></textarea>
          </div>
        </div>

        <!-- Summary -->
        <div class="py-6 max-w-[456px] ml-auto">
          <div class="flex justify-between items-center mb-4">
            <span class="font-archivo-narrow font-semibold text-xl">SUBTOTAL</span>
            <span class="font-archivo-narrow font-semibold text-xl">${{ calculateSubtotal().toFixed(2) }}</span>
          </div>

          <p class="font-archivo text-black/70 mb-6">
            Taxes and shipping calculated at checkout
          </p>

          <button class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-2xl hover:opacity-90">
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShoppingCartPage',
  data() {
    return {
      cartItems: [
        {
          name: 'Produto 1',
          description: 'Descrição do produto 1',
          price: 199.99,
          quantity: 1,
          image: '/img/product1.png'
        },
        {
          name: 'Produto 2',
          description: 'Descrição do produto 2',
          price: 299.99,
          quantity: 1,
          image: '/img/product2.png'
        },
        {
          name: 'Produto 3',
          description: 'Descrição do produto 3',
          price: 399.99,
          quantity: 1,
          image: '/img/product3.png'
        }
      ],
      showNotes: false,
      notes: ''
    }
  },
  methods: {
    toggleNotes() {
      this.showNotes = !this.showNotes
    },
    increaseQuantity(index) {
      this.cartItems[index].quantity++
    },
    decreaseQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--
      }
    },
    calculateSubtotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    removeItem(index) {
      this.cartItems.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.shopping-cart-page {
  min-height: 100vh;
  background-color: white;
}

textarea::placeholder {
  color: rgba(0, 0, 0, 0.5);
}
</style>