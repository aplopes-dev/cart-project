import { defineStore } from 'pinia'
import api from '@/services/api'

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
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.id) throw new Error('User not found')

        const response = await api.get(`/users/${user.id}/addresses`)
        this.addresses = response.data.map(addr => ({
          id: addr.id,
          address_line_1: addr.address_line_1 || addr.address, // Compatibilidade com estrutura antiga
          address_line_2: addr.address_line_2 || addr.landmark || '',
          city: addr.city,
          state: addr.state || '',
          postal_code: addr.postal_code,
          country: addr.country || '',
          is_default: addr.is_default,
          isDefault: addr.is_default // Mantém ambos para compatibilidade
        }))
      } catch (error) {
        console.error('Error fetching addresses:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
