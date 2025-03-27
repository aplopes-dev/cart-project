import { defineStore } from 'pinia'
import api from '@/services/api' // Corrigido: removido as chaves da importação

export const useAddressStore = defineStore('address', {
  state: () => ({
    addresses: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchAddresses() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/addresses')
        this.addresses = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
