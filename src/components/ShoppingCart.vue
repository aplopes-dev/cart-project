<template>
  <section class="shopping-cart">
    <div class="cart-header">
      <h1>{{ $t('cart.shoppingCart') }}</h1>
      <button class="close-button">
        <!-- Add close icon here -->
      </button>
    </div>

    <div class="cart-items">
      <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
        <img :src="item.image" :alt="item.name" class="item-image" />
        
        <div class="item-details">
          <div class="item-info">
            <h2>{{ item.name }}</h2>
            <p class="price">{{ formatPrice(item.price) }}</p>
          </div>

          <div class="quantity-selector">
            <button 
              class="quantity-btn" 
              @click="decreaseQuantity(index)"
              :aria-label="$t('cart.decrease')"
            >-</button>
            <span>{{ item.quantity }}</span>
            <button 
              class="quantity-btn" 
              @click="increaseQuantity(index)"
              :aria-label="$t('cart.increase')"
            >+</button>
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
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

useI18n()  // Remover a desestruturação de 't'

const cartItems = ref([
  {
    name: 'Lorem Ipsum',
    price: 32.00,
    quantity: 1,
    image: '/images/product1.png'
  }
  // Add more items as needed
])

const increaseQuantity = (index) => {
  cartItems.value[index].quantity++
}

const decreaseQuantity = (index) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--
  }
}

const removeItem = (index) => {
  cartItems.value.splice(index, 1)
}
</script>

<style scoped>
.shopping-cart {
  width: 456px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #000000;
}

.quantity-btn {
  width: 16px;
  height: 16px;
  border: 1.6px solid #1E1E1E;
  background: none;
  cursor: pointer;
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
</style>