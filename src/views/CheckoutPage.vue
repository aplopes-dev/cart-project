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
                <div class="flex items-center cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('personal')">
                  <h2 class="font-archivo-narrow font-semibold text-2xl">Personal Details</h2>
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
                <div class="flex items-center cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('shipping')">
                  <h2 class="font-archivo-narrow font-semibold text-2xl">Shipping Details</h2>
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

              <!-- Payment Section -->
              <section>
                <div class="flex items-center cursor-pointer lg:cursor-default mb-6 relative pr-12" @click="toggleSection('payment')">
                  <h2 class="font-archivo-narrow font-semibold text-2xl">Payment Details</h2>
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

                    <!-- Botão de remover - sempre à direita -->
                    <button 
                      class="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-[#E30505]/10 transition-colors rounded-sm"
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
      sections: {
        personal: true,
        shipping: true,
        payment: true
      },
      isDesktop: window.innerWidth >= 1024,
      cartItems: [
        {
          name: 'Product Name 1',
          price: 99.99,
          quantity: 1,
          image: '/img/product1.png'
        },
        {
          name: 'Product Name 2',
          price: 149.99,
          quantity: 2,
          image: '/img/product2.png'
        }
      ]
    }
  },
  mounted() {
    window.addEventListener('resize', this.checkDesktop)
    // Aqui você pode carregar os itens do carrinho
    // Por exemplo, de uma store ou localStorage
    this.cartItems = [
      // Exemplo de dados
      {
        name: 'Produto 1',
        price: 99.99,
        quantity: 1,
        image: '/img/product1.png'
      }
      // Adicione mais itens conforme necessário
    ]
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
    calculateSubtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    async completePurchase() {
      try {
        // Aqui você pode adicionar a lógica de processamento do pedido
        console.log('Processing purchase...')
        
        // Redireciona para a página de agradecimento
        await this.$router.push('/thank-you')
      } catch (error) {
        console.error('Navigation error:', error)
      }
    },
    removeItem(index) {
      this.cartItems.splice(index, 1)
    },
    calculateTotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
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