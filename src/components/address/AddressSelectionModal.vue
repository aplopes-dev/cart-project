<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" @click="close">
        <div class="absolute inset-0 bg-black opacity-75"></div>
      </div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="font-archivo-narrow font-semibold text-2xl mb-6">
                {{ $t('checkout.selectAddress') }}
              </h3>
              
              <!-- Lista de endereços -->
              <div class="space-y-4">
                <div 
                  v-for="address in addresses" 
                  :key="address.id"
                  class="border border-black/25 p-4 rounded relative"
                >
                  <!-- Indicador de endereço padrão -->
                  <div v-if="address.isDefault" class="absolute top-2 right-2 bg-empire-yellow px-2 py-1 text-xs font-archivo">
                    {{ $t('addresses.default') }}
                  </div>

                  <!-- Informações do endereço -->
                  <div class="font-archivo space-y-1">
                    <p>{{ address.address }}</p>
                    <p v-if="address.apartment">{{ address.apartment }}</p>
                    <p>{{ address.city }}, {{ address.state }} {{ address.postalCode }}</p>
                    <p>{{ address.country }}</p>
                  </div>

                  <!-- Botões de ação -->
                  <div class="flex justify-between mt-4">
                    <button 
                      @click="selectAddress(address)"
                      class="bg-empire-yellow px-4 py-2 font-archivo-narrow font-semibold"
                    >
                      {{ $t('checkout.useThisAddress') }}
                    </button>
                    
                    <button 
                      @click="editAddress(address.id)"
                      class="border border-black px-4 py-2 font-archivo-narrow font-semibold"
                    >
                      {{ $t('common.edit') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="close"
          >
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'AddressSelectionModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    addresses: {
      type: Array,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    selectAddress(address) {
      this.$emit('select', address)
      this.close()
    },
    editAddress(addressId) {
      this.router.push(`/addresses?edit=${addressId}`)
    }
  }
}
</script>