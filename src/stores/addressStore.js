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
          address: addr.address,
          number: addr.number,
          neighborhood: addr.neighborhood,
          apartment: addr.complement,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postal_code,
          country: addr.country,
          isDefault: addr.is_default
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
