import { defineStore } from 'pinia'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    orderNotes: '',
    shippingCost: 0,
    taxAmount: 0
  }),
  
  actions: {
    setOrderNotes(notes) {
      this.orderNotes = notes || '' // Garantir que nunca seja null/undefined
    },
    setShippingCost(cost) {
      this.shippingCost = cost
    },
    setTaxAmount(amount) {
      this.taxAmount = amount
    },
    clearCheckoutData() {
      this.orderNotes = ''
      this.shippingCost = 0
      this.taxAmount = 0
    }
  }
})
