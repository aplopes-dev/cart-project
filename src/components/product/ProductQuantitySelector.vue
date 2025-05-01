<template>
  <div class="flex flex-row gap-1 sm:gap-2">
    <!-- Contador de Quantidade -->
    <div :class="[
      'w-[100px] sm:w-[120px]',
      isProductDetailsPage ? 'h-[40px] sm:h-[50px]' : 'h-[28px] sm:h-[35px]'
    ]">
      <div class="flex flex-row justify-between items-center h-full border-2 border-black bg-white">
        <button
          @click="decrementQuantity"
          class="flex items-center justify-center w-[30px] sm:w-[35px] h-full hover:bg-black/5"
          :aria-label="$t('cart.decrease')"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none">
            <path d="M3.33337 8H12.6667" stroke="#1E1E1E" stroke-width="1.6"/>
          </svg>
        </button>

        <input
          type="number"
          v-model.number="quantity"
          min="1"
          class="font-archivo font-bold text-sm sm:text-[18px] text-[#010101] text-center w-[40px] sm:w-[50px] h-full border-0 focus:outline-none appearance-none"
          :aria-label="$t('cart.quantity')"
          style="-moz-appearance: textfield;"
        />

        <button
          @click="incrementQuantity"
          class="flex items-center justify-center w-[30px] sm:w-[35px] h-full hover:bg-black/5"
          :aria-label="$t('cart.increase')"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.33337V12.6667M3.33337 8H12.6667" stroke="#1E1E1E" stroke-width="1.6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Botão Add Cart -->
    <button
      :class="[
        'flex-1 bg-black flex justify-center items-center',
        isProductDetailsPage ? 'h-[40px] sm:h-[50px]' : 'h-[28px] sm:h-[35px]'
      ]"
      @click="addToCart"
    >
      <span :class="[
        'font-archivo-narrow font-bold text-[#FFDD00]',
        isProductDetailsPage ? 'text-[18px] sm:text-[24px] leading-[40px] sm:leading-[50px]' : 'text-[15px] sm:text-[20px] leading-[28px] sm:leading-[35px]'
      ]">
        {{ $t('cart.addToCart') }}
      </span>
    </button>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars, no-undef */
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const emit = defineEmits(['add-to-cart'])
/* eslint-enable no-unused-vars, no-undef */

// Verifica se o componente está sendo usado na página de detalhes do produto
const isProductDetailsPage = ref(route.name === 'ProductDetails')

const quantity = ref(1)

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Validar entrada manual de quantidade
watch(quantity, (newValue) => {
  // Converter para número
  let numValue = parseInt(newValue)

  // Verificar se é um número válido
  if (isNaN(numValue) || numValue < 1) {
    quantity.value = 1
  } else {
    // Limitar a um valor razoável para evitar problemas
    if (numValue > 999) {
      quantity.value = 999
    } else {
      quantity.value = numValue
    }
  }
})

const addToCart = () => {
  emit('add-to-cart', quantity.value)
}
</script>
<style scoped>
.font-archivo-narrow {
  font-family: 'Archivo Narrow', sans-serif;
}

.font-archivo {
  font-family: 'Archivo', sans-serif;
}

/* Remove as setas do input number em todos os navegadores */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>

