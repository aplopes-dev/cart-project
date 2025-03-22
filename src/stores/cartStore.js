import { defineStore } from 'pinia'
import api from '@/services/api'

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
    async loadCartFromStorage(userId) {
      try {
        // Verifica se existe carrinho de visitante
        const guestCart = localStorage.getItem('cart_guest')
        const guestCartItems = guestCart ? JSON.parse(guestCart) : []
        
        // Primeiro tenta carregar do localStorage do usuário
        const localCart = localStorage.getItem(`cart_${userId}`)
        if (localCart) {
          const cartItems = JSON.parse(localCart)
          this.items = cartItems
          
          // Remove o carrinho de visitante se existir
          localStorage.removeItem('cart_guest')
          return cartItems
        }

        // Busca carrinho do banco independente do guest cart
        let dbCartItems = []
        try {
          const response = await api.get(`/cart/${userId}`)
          if (response.data && response.data.items && response.data.items.length > 0) {
            dbCartItems = response.data.items.map(item => ({
              id: item.productId,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
              image: item.image
            }))
          }
        } catch (error) {
          console.error('Error fetching cart from database:', error)
        }

        // Se tem itens no guest cart ou no banco, mescla os dois
        if (guestCartItems.length > 0 || dbCartItems.length > 0) {
          // Cria um Map com os itens do banco usando o id como chave
          const mergedItems = new Map()
          
          // Adiciona primeiro os itens do banco
          dbCartItems.forEach(item => {
            mergedItems.set(item.id, item)
          })

          // Adiciona ou atualiza com os itens do guest cart
          guestCartItems.forEach(guestItem => {
            const existingItem = mergedItems.get(guestItem.id)
            if (existingItem) {
              // Se o item já existe, soma as quantidades
              existingItem.quantity += guestItem.quantity
            } else {
              // Se não existe, adiciona o novo item
              mergedItems.set(guestItem.id, guestItem)
            }
          })

          // Converte o Map de volta para array
          const finalCartItems = Array.from(mergedItems.values())
          
          // Atualiza o estado e localStorage
          this.items = finalCartItems
          localStorage.setItem(`cart_${userId}`, JSON.stringify(finalCartItems))
          localStorage.removeItem('cart_guest')

          // Sincroniza o carrinho mesclado com o backend
          await this.syncCartWithBackend()
          
          return finalCartItems
        }

        // Se não encontrou nada em lugar nenhum, retorna array vazio
        return []
      } catch (error) {
        console.error('Error loading cart:', error)
        return []
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

    // Função auxiliar para salvar no localStorage
    saveToLocalStorage() {
      const userId = JSON.parse(localStorage.getItem('user'))?.id
      const storageKey = userId ? `cart_${userId}` : 'cart_guest'
      localStorage.setItem(storageKey, JSON.stringify(this.items))
    },

    addItem(item) {
      const existingItemIndex = this.items.findIndex(i => i.id === item.id)
      
      if (existingItemIndex > -1) {
        this.items[existingItemIndex].quantity += item.quantity
      } else {
        this.items.push(item)
      }

      this.saveToLocalStorage()
    },

    removeItem(index) {
      this.items.splice(index, 1)
      this.saveToLocalStorage()
    },

    updateQuantity(index, quantity) {
      if (quantity > 0) {
        this.items[index].quantity = quantity
        this.saveToLocalStorage()
      }
    },

    $reset() {
      this.items = []
      this.isOpen = false
      this.saveToLocalStorage()
    },

    async clearCart() {
      this.items = []
      this.isOpen = false
      
      const userId = JSON.parse(localStorage.getItem('user'))?.id
      if (userId) {
        localStorage.removeItem(`cart_${userId}`)
        try {
          await api.delete(`/cart/${userId}`)
        } catch (error) {
          console.error('Error clearing cart from database:', error)
        }
      } else {
        localStorage.removeItem('cart_guest')
      }
    },

    async syncCartWithBackend() {
      try {
        const userId = JSON.parse(localStorage.getItem('user'))?.id;
        if (userId && this.items.length > 0) {
          const response = await api.post('/cart/sync', {
            items: this.items.map(item => ({
              productId: item.id,
              quantity: item.quantity
            }))
          });

          // Atualiza o estado e localStorage com a resposta da API
          if (response.data && response.data.items) {
            const cartItems = response.data.items.map(item => ({
              id: item.productId,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
              image: item.image
            }));

            this.items = cartItems;
            localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
          }
        }
      } catch (error) {
        console.error('Error syncing cart:', error);
        throw error;
      }
    }
  }
})






























