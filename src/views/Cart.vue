<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">{{ $t('cart.shoppingCart') }}</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="space-y-4">
          <CartItem
            v-for="item in cartItems"
            :key="item.id"
            :product="item.product"
            :quantity="item.quantity"
            @update:quantity="updateQuantity(item.id, $event)"
          />
        </div>
      </div>
      
      <div>
        <CartSummary
          :subtotal="subtotal"
          :shipping="shipping"
          :total="total"
          @checkout="handleCheckout"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'

export default defineComponent({
  name: 'CartView',
  components: {
    CartItem,
    CartSummary
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      cartItems: [], // Será integrado com Pinia
      subtotal: 'R$ 0,00',
      shipping: 'R$ 0,00',
      total: 'R$ 0,00'
    }
  },
  methods: {
    updateQuantity(itemId, newQuantity) {
      const item = this.cartItems.find((i) => i.id === itemId)
      if (item) {
        item.quantity = newQuantity
        this.updateTotals()
      }
    },
    handleCheckout() {
      this.$router.push('/checkout')
    },
    updateTotals() {
      // Implementar cálculo de totais
      console.log('Atualizando totais...')
    }
  }
})
</script>