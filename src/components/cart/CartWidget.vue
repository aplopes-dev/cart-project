<template>
  <div 
    class="fixed right-0 top-0 h-screen w-full md:w-[456px] bg-white shadow-cart z-50 flex flex-col px-4 md:px-6"
  >
    <!-- Shopping Cart Section -->
    <section class="shopping-cart flex-grow overflow-y-auto">
      <div class="cart-header">
        <h1 class="text-2xl md:text-[34px]">SHOPPING CART</h1>
        <button class="close-button" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="black" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="cart-items">
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <img :src="item.image" :alt="item.name" class="item-image" />
          
          <div class="item-details">
            <div class="item-info">
              <h2>{{ item.name }}</h2>
              <p class="price">${{ item.price.toFixed(2) }}</p>
            </div>

            <div class="quantity-selector">
              <button class="quantity-btn minus" @click="decreaseQuantity(index)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="3.33" y1="8" x2="12.67" y2="8" stroke="#1E1E1E" stroke-width="1.6"/>
                </svg>
              </button>
              <span class="quantity-value">{{ item.quantity }}</span>
              <button class="quantity-btn plus" @click="increaseQuantity(index)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="3.33" y1="8" x2="12.67" y2="8" stroke="#1E1E1E" stroke-width="1.6"/>
                  <line x1="8" y1="3.33" x2="8" y2="12.67" stroke="#1E1E1E" stroke-width="1.6"/>
                </svg>
              </button>
            </div>
          </div>

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
    </section>

    <!-- Subtotal Section -->
    <div class="flex flex-col items-start w-full gap-2 mt-auto pb-4">
      <div class="flex justify-between items-center py-2 w-full">
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl text-black/70">
          SUBTOTAL
        </span>
        <span class="font-archivo-narrow font-semibold text-xl md:text-2xl text-black/70">
          $ {{ calculateSubtotal().toFixed(2) }}
        </span>
      </div>
      
      <p class="font-archivo font-normal text-base md:text-lg text-black w-full">
        Taxes and shipping calculated at checkout
      </p>

      <!-- Buttons Section -->
      <div class="flex flex-col items-start w-full gap-2">
        <button 
          class="flex justify-center items-center w-full h-[50px] md:h-[60px] border-3 border-black"
          @click="viewCart"
        >
          <span class="font-archivo-narrow font-semibold text-xl md:text-2xl text-black">
            VIEW CART
          </span>
        </button>

        <button 
          class="flex justify-center items-center w-full h-[50px] md:h-[60px] bg-empire-yellow"
          @click="checkout"
        >
          <span class="font-archivo-narrow font-semibold text-xl md:text-2xl text-black">
            CHECKOUT
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartWidget',
  data() {
    return {
      cartItems: [
        {
          name: 'Lorem Ipsum',
          price: 32.00,
          quantity: 1,
          image: '/images/product1.png'
        }
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
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    checkout() {
      console.log('Iniciando checkout...')
    },
    viewCart() {
      this.$emit('close') // Fecha o widget primeiro
      this.$router.push('/shopping-cart') // Depois navega para a página
    }
  }
}
</script>

<style scoped>
.shadow-cart {
  box-shadow: 0px -10px 25.4px -2px rgba(12, 12, 13, 0.08);
}

.shopping-cart {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - 160px);
  padding: 12px;
  background-color: white;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.cart-header h1 {
  font-family: 'Archivo Narrow';
  font-weight: 600;
  font-size: 34px;
  line-height: 40px;
}

.cart-items {
  flex: 1;
  overflow-y: auto; /* Permite rolagem apenas na área dos itens */
  padding-right: 8px; /* Espaço para a barra de rolagem */
}

/* Estiliza a barra de rolagem para melhor visual */
.cart-items::-webkit-scrollbar {
  width: 4px;
}

.cart-items::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.cart-items::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 32px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.item-image {
  width: 120px;
  height: 110px;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-info h2 {
  font-family: 'Archivo';
  font-weight: 400;
  font-size: 34px;
  line-height: 40px;
}

.price {
  font-family: 'Archivo';
  font-size: 22px;
  line-height: 40px;
}

.quantity-selector {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px 12px 16px;
  gap: 8px;
  isolation: isolate;
  width: 151px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #000000;
}

.quantity-btn {
  margin: 0 auto;
  width: 16px;
  height: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn svg line {
  position: absolute;
  left: 20.83%;
  right: 20.83%;
}

.quantity-value {
  margin: 0 auto;
  width: 8px;
  height: 16px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  color: #1E1E1E;
}

/* Removendo os estilos anteriores que possam conflitar */
.quantity-selector button:hover {
  opacity: 1;
}

.quantity-selector button:focus {
  outline: none;
}

.delete-btn {
  margin: 0 auto;
  width: 32px;
  height: 32px;
  border: 3px solid #E30505;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 2px;
  transition: background-color 0.2s ease;
  flex: none;
  order: 2;
  flex-grow: 0;
}

.delete-btn:hover {
  background-color: rgba(227, 5, 5, 0.1);
}

.delete-btn svg {
  width: 24px;
  height: 24px;
}

.close-button {
  padding: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .shopping-cart {
    height: calc(100vh - 140px);
    padding: 8px;
  }

  .cart-item {
    padding: 16px 0;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .quantity-selector {
    width: 120px;
    height: 36px;
    padding: 8px;
  }
}
</style>