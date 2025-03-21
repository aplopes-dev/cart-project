<template>
  <div class="flex flex-col sm:flex-row items-start gap-2 w-full">
    <!-- Contador de Quantidade -->
    <div class="w-full sm:w-[150px] h-[73.31px]"> <!-- Aumentado de 94.28px para 150px -->
      <div class="flex flex-row justify-between items-center h-full border-2 border-black bg-white">
        <button 
          @click="decrementQuantity" 
          class="flex items-center justify-center w-[40px] h-full hover:bg-black/5"
          :aria-label="$t('cart.decrease')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.33337 8H12.6667" stroke="#1E1E1E" stroke-width="1.6"/>
          </svg>
        </button>
        
        <div class="font-archivo font-bold text-[22px] text-[#010101] flex items-center justify-center"
             :aria-label="$t('cart.quantity')">
          {{ quantity }}
        </div>
        
        <button 
          @click="incrementQuantity" 
          class="flex items-center justify-center w-[40px] h-full hover:bg-black/5"
          :aria-label="$t('cart.increase')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.33337V12.6667M3.33337 8H12.6667" stroke="#1E1E1E" stroke-width="1.6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Botão Add Cart -->
    <button 
      class="w-full sm:flex-1 h-[73.31px] bg-black flex justify-center items-center"
      @click="addToCart"
    >
      <span class="font-archivo-narrow font-semibold text-[34px] leading-[72px] text-[#FFDD00]">
        {{ $t('cart.addToCart') }}
      </span>
    </button>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars, no-undef */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['add-to-cart'])
/* eslint-enable no-unused-vars, no-undef */

const quantity = ref(1)

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

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
</style>

