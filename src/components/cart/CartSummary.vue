<template>
  <div class="p-4 border rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Resumo do Pedido</h2>
    <div class="space-y-2">
      <div class="flex justify-between">
        <span>Subtotal</span>
        <span>{{ subtotal }}</span>
      </div>
      <div class="flex justify-between">
        <span>Frete</span>
        <span>{{ shipping }}</span>
      </div>
      <div class="border-t pt-2 mt-2">
        <div class="flex justify-between font-semibold">
          <span>Total</span>
          <span>{{ total }}</span>
        </div>
      </div>
    </div>
    <BaseButton 
      variant="primary"
      class="w-full mt-4"
      @click="checkout"
    >
      Finalizar Compra
    </BaseButton>
  </div>
</template>

<script>
import BaseButton from '../ui/BaseButton.vue'

export default {
  name: 'CartSummary',
  components: {
    BaseButton
  },
  props: {
    subtotal: {
      type: String,
      required: true
    },
    shipping: {
      type: String,
      required: true
    },
    total: {
      type: String,
      required: true
    }
  },
  methods: {
    checkout() {
      this.$emit('checkout')
    }
  }
}
</script>