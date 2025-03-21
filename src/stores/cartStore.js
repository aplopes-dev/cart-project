import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false
  }),
  
  getters: {
    totalItems: (state) => state.items.length,
    subtotal: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  },
  
  actions: {
    addItem(item) {
      // Ensure price is stored as a number
      const normalizedItem = {
        ...item,
        price: Number(item.price)
      }
      
      // Check if item already exists in cart
      const existingItemIndex = this.items.findIndex(
        cartItem => cartItem.id === normalizedItem.id &&
                   cartItem.color === normalizedItem.color &&
                   cartItem.size === normalizedItem.size
      )

      if (existingItemIndex !== -1) {
        // If item exists, update quantity
        this.items[existingItemIndex].quantity += normalizedItem.quantity
      } else {
        // If item doesn't exist, add new item
        this.items.push(normalizedItem)
      }
    },
    
    removeItem(index) {
      this.items.splice(index, 1)
    },
    
    updateQuantity(index, quantity) {
      if (quantity > 0) {
        this.items[index].quantity = quantity
      }
    },
    
    toggleCart() {
      this.isOpen = !this.isOpen
    },
    
    closeCart() {
      this.isOpen = false
    }
  }
})

