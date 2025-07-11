import { defineStore } from 'pinia'
import api from '@/services/api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false
  }),

  getters: {
    totalItems: (state) => state.items.length,
    subtotal: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    total: (state) => {
      const subtotalValue = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shippingValue = parseFloat(state.shipping || 0)
      const taxesValue = parseFloat(state.taxes || 0)
      return (subtotalValue + shippingValue + taxesValue).toFixed(2)
    }
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
          // Agrupa os itens carregados do localStorage para garantir consistência
          const groupedItems = this.groupCartItems(cartItems)
          this.items = groupedItems

          // Salva os itens agrupados de volta no localStorage
          localStorage.setItem(`cart_${userId}`, JSON.stringify(groupedItems))

          // Remove o carrinho de visitante se existir
          localStorage.removeItem('cart_guest')
          return groupedItems
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
              image: item.image,
              color: item.color,
              size: item.size,
              weight: item.weight,
              unit: item.unit,
              foxpro_code: item.foxpro_code
            }))
          }
        } catch (error) {
          console.error('Error fetching cart from database:', error)
        }

        // Se tem itens no guest cart ou no banco, mescla os dois
        if (guestCartItems.length > 0 || dbCartItems.length > 0) {
          // Combina todos os itens em um array único
          const allItems = [...dbCartItems, ...guestCartItems]

          // Aplica o agrupamento para mesclar itens duplicados
          const finalCartItems = this.groupCartItems(allItems)

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

    async addItem(item) {
      // Verifica se existe um item com o mesmo ID e as mesmas características
      const existingItemIndex = this.items.findIndex(i =>
        i.id === item.id &&
        i.color === item.color &&
        i.size === item.size &&
        i.weight === item.weight &&
        i.unit === item.unit
      )

      if (existingItemIndex > -1) {
        // Se encontrou um item com as mesmas características, apenas incrementa a quantidade
        this.items[existingItemIndex].quantity += item.quantity
      } else {
        // Se não encontrou, adiciona como um novo item
        this.items.push(item)
      }

      this.saveToLocalStorage()

      // Sincroniza com o backend para obter dados completos do produto
      const userId = JSON.parse(localStorage.getItem('user'))?.id
      if (userId) {
        try {
          await this.syncCartWithBackend()
        } catch (error) {
          console.error('Error syncing cart after adding item:', error)
        }
      }
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
          // Alterando a chamada da API para usar o endpoint correto
          await api.delete('/cart') // Removido o userId da URL
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
              quantity: item.quantity,
              color: item.color,
              size: item.size,
              weight: item.weight,
              unit: item.unit
            }))
          });

          // Atualiza o estado e localStorage com a resposta da API
          if (response.data && response.data.items) {
            const apiItems = response.data.items.map(item => ({
              id: item.productId,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
              image: item.image,
              color: item.color,
              size: item.size,
              weight: item.weight,
              unit: item.unit,
              foxpro_code: item.foxpro_code
            }));

            // Agrupa os itens retornados da API para evitar duplicatas
            const groupedItems = this.groupCartItems(apiItems);

            this.items = groupedItems;
            localStorage.setItem(`cart_${userId}`, JSON.stringify(groupedItems));
          }
        }
      } catch (error) {
        console.error('Error syncing cart:', error);
        throw error;
      }
    },

    // Função auxiliar para agrupar itens do carrinho
    groupCartItems(items) {
      const groupedMap = new Map();

      items.forEach(item => {
        // Cria uma chave única baseada no ID e características do produto
        const key = `${item.id}_${item.color || ''}_${item.size || ''}_${item.weight || ''}_${item.unit || ''}`;

        if (groupedMap.has(key)) {
          // Se já existe um item com as mesmas características, soma as quantidades
          const existingItem = groupedMap.get(key);
          existingItem.quantity += item.quantity;
        } else {
          // Se não existe, adiciona o novo item
          groupedMap.set(key, { ...item });
        }
      });

      return Array.from(groupedMap.values());
    }
  }
})



































