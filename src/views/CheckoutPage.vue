<template>
  <div class="checkout-page">
    <div class="container mx-auto px-4">
      <div class="max-w-[1408px] mx-auto py-8">
        <!-- Title -->
        <div class="pb-6 text-center">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">CHECKOUT</h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Personal Details Form -->
          <div class="lg:col-span-8">
            <div class="space-y-8 bg-[#FAFAFA] p-8">
              <!-- Personal Details Section -->
              <section>
                <h2 class="font-archivo-narrow font-semibold text-2xl mb-6">Personal Details</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block font-archivo text-sm mb-2">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your first name..."
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your last name..."
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">Email</label>
                    <input 
                      type="email" 
                      placeholder="Enter your Email..."
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="Enter your Phone number..."
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
                    >
                  </div>
                </div>
              </section>

              <!-- Shipping Address Section -->
              <section>
                <h2 class="font-archivo-narrow font-semibold text-2xl mb-6">Shipping Address</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block font-archivo text-sm mb-2">Address Line 1</label>
                    <input 
                      type="text" 
                      placeholder="Enter your full address..."
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">City</label>
                    <input 
                      type="text" 
                      placeholder="Your city"
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">State</label>
                    <input 
                      type="text" 
                      placeholder="Your State"
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">Landmark</label>
                    <input 
                      type="text" 
                      placeholder="Any landmark (famous place or mall)"
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
                    >
                  </div>
                  <div>
                    <label class="block font-archivo text-sm mb-2">Postal Code</label>
                    <input 
                      type="text" 
                      placeholder="ZIP Code (231216)"
                      class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white"
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
                  <h2 class="font-archivo-narrow font-semibold text-[34px] leading-[40px] text-center mx-auto">SUMMARY</h2>
                </div>

                <!-- Products List -->
                <div class="space-y-0">
                  <div v-for="(item, index) in cartItems" :key="index" 
                    class="flex justify-between items-start py-8 border-b border-black/25">
                    <img :src="item.image" :alt="item.name" class="w-[120px] h-[110px] object-cover"/>
                    
                    <div class="flex flex-col gap-4">
                      <div class="flex items-center gap-2">
                        <div class="flex justify-center items-center w-[22px] h-[22px] bg-black">
                          <span class="font-archivo font-semibold text-xs text-empire-yellow">{{ item.quantity }}x</span>
                        </div>
                        <span class="font-archivo text-[22px] leading-[40px]">{{ item.name }}</span>
                      </div>
                    </div>

                    <span class="font-archivo text-[22px] leading-[40px]">${{ (item.price * item.quantity).toFixed(2) }}</span>
                    
                    <button 
                      class="w-8 h-8 flex items-center justify-center hover:bg-[#E30505]/10 transition-colors rounded-sm"
                      @click="removeItem(index)"
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
                </div>

                <!-- Totals -->
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <span class="font-archivo text-[22px] leading-[40px]">Taxes</span>
                    <span class="font-archivo text-[22px] leading-[40px]">$ 0.00</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-archivo text-[22px] leading-[40px]">Shipping</span>
                    <span class="font-archivo text-[22px] leading-[40px]">$ 0.00</span>
                  </div>
                  <div class="flex justify-between items-center py-4">
                    <span class="font-archivo-narrow font-semibold text-[34px] leading-[40px] text-black/70">SUBTOTAL</span>
                    <span class="font-archivo-narrow font-semibold text-[34px] leading-[40px] text-black/70">
                      ${{ calculateSubtotal().toFixed(2) }}
                    </span>
                  </div>
                </div>

                <!-- Complete Purchase Button -->
                <button 
                  class="w-full bg-empire-yellow py-4 font-archivo-narrow font-semibold text-[34px] leading-[72px] text-center"
                  @click="completePurchase"
                >
                  COMPLETE PURCHASE
                </button>
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
  name: 'CheckoutPage',
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
      ]
    }
  },
  methods: {
    calculateSubtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    completePurchase() {
      console.log('Processing purchase...')
      // Implement checkout logic here
    },
    removeItem(index) {
      this.cartItems.splice(index, 1)
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
</style>