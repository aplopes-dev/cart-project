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
    loadCartFromStorage(userId) {
      if (userId) {
        const savedCart = localStorage.getItem(`cart_${userId}`)
        if (savedCart) {
          this.items = JSON.parse(savedCart)
        }
      }
    },

    saveCartToStorage(userId) {
      if (userId) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(this.items))
      }
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    closeCart() {
      this.isOpen = false
    },

    addItem(item) {
      const existingItemIndex = this.items.findIndex(i => i.id === item.id)
      
      if (existingItemIndex > -1) {
        this.items[existingItemIndex].quantity += item.quantity
      } else {
        this.items.push(item)
      }

      const userId = JSON.parse(localStorage.getItem('user'))?.id
      if (userId) {
        this.saveCartToStorage(userId)
      }
    },

    removeItem(index) {
      this.items.splice(index, 1)
      const userId = JSON.parse(localStorage.getItem('user'))?.id
      if (userId) {
        this.saveCartToStorage(userId)
      }
    },

    updateQuantity(index, quantity) {
      if (quantity > 0) {
        this.items[index].quantity = quantity
        const userId = JSON.parse(localStorage.getItem('user'))?.id
        if (userId) {
          this.saveCartToStorage(userId)
        }
      }
    },

    $reset() {
      this.items = []
      this.isOpen = false
    }
  }
})



