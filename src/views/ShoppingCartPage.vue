<template>
  <div class="shopping-cart-page">
    <div class="bg-white w-full relative z-[45]"> <!-- Aumentado z-index e adicionado relative -->
      <div class="container mx-auto px-4">
        <div class="max-w-[1408px] mx-auto">
          <!-- Header -->
          <div class="page-title">
            <h1 class="font-archivo-narrow font-semibold text-4xl md:text-5xl text-center text-empire-dark">
              SHOPPING CART
            </h1>
          </div>

          <!-- Conteúdo do carrinho -->
          <div class="p-4 md:p-8">
            <div class="flex flex-col lg:flex-row gap-8">
              <!-- Cart Items Section -->
              <div class="flex-grow">
                <div v-if="cartItems.length > 0" class="space-y-6">
                  <div v-for="(item, index) in cartItems" :key="index" 
                       class="flex flex-col md:flex-row items-center md:items-start gap-6 p-4 md:p-6 border border-gray-200">
                    <!-- Product Image -->
                    <img :src="item.image" :alt="item.name" 
                         class="w-[120px] h-[120px] object-cover"/>
                
                    <!-- Product Details -->
                    <div class="flex-grow w-full md:w-auto text-center md:text-left">
                      <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl mb-2">{{ item.name }}</h2>
                      <p class="font-archivo text-base md:text-lg text-black/70 mb-4">${{ item.price.toFixed(2) }}</p>
                  
                      <!-- Quantity Controls -->
                      <div class="flex items-center justify-center md:justify-start gap-4">
                        <div class="flex items-center border border-gray-300">
                          <button @click="decreaseQuantity(index)" 
                                  class="px-3 md:px-4 py-2 text-lg md:text-xl">-</button>
                          <span class="px-3 md:px-4 py-2 text-lg md:text-xl">{{ item.quantity }}</span>
                          <button @click="increaseQuantity(index)" 
                                  class="px-3 md:px-4 py-2 text-lg md:text-xl">+</button>
                        </div>
                    
                        <!-- Delete Button -->
                        <button class="delete-btn" @click="removeItem(index)">
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
                <div v-else class="text-center py-8">
                  <p class="text-lg mb-4">Your cart is empty</p>
                  <button 
                    @click="$router.push('/shop')"
                    class="mt-4 px-6 py-2 bg-empire-yellow font-archivo-narrow font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              <!-- Summary Section -->
              <div v-if="cartItems.length > 0" class="w-full lg:w-[456px]">
                <div class="bg-gray-50 p-4 md:p-6">
                  <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl mb-6 text-center md:text-left">
                    ORDER SUMMARY
                  </h2>
              
                  <!-- Subtotal -->
                  <div class="flex justify-between items-center mb-4">
                    <span class="font-archivo text-lg">Subtotal</span>
                    <span class="font-archivo-narrow font-semibold text-xl">
                      ${{ calculateSubtotal().toFixed(2) }}
                    </span>
                  </div>

                  <!-- Shipping -->
                  <div class="flex justify-between items-center mb-4">
                    <span class="font-archivo text-lg">Shipping</span>
                    <span class="font-archivo-narrow font-semibold text-xl">$0.00</span>
                  </div>

                  <!-- Total -->
                  <div class="flex justify-between items-center border-t border-gray-300 pt-4 mb-6">
                    <span class="font-archivo-narrow font-semibold text-xl">Total</span>
                    <span class="font-archivo-narrow font-semibold text-2xl">
                      ${{ calculateSubtotal().toFixed(2) }}
                    </span>
                  </div>

                  <!-- Checkout Button -->
                  <button 
                    @click="checkout"
                    class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-2xl"
                  >
                    CHECKOUT
                  </button>
                </div>
              </div>
            </div>
          </div>
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
          name: 'Product Name',
          price: 99.99,
          quantity: 1,
          image: 'https://via.placeholder.com/120'
        },
        // Adicione mais itens conforme necessário
      ]
    }
  },
  methods: {
    increaseQuantity(index) {
      this.cartItems[index].quantity++
    },
    decreaseQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--
      }
    },
    removeItem(index) {
      this.cartItems.splice(index, 1)
    },
    calculateSubtotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
    checkout() {
      // Implementar lógica de checkout
      console.log('Proceeding to checkout...')
    }
  }
}
</script>

<style scoped>
.shopping-cart-page {
  padding-top: 180px;
  min-height: 100vh;
  background-color: white;
  position: relative;
  z-index: 45;
}

.page-title {
  padding: 60px 0 40px;
  position: relative;
  z-index: 46;
}

@media (max-width: 768px) {
  .shopping-cart-page {
    padding-top: 140px;
  }

  .page-title {
    padding: 40px 0 24px;
  }
}

.delete-btn {
  padding: 4px;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.delete-btn:hover {
  background-color: rgba(227, 5, 5, 0.1);
}
</style>