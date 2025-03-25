<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('addresses.title') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('addresses.title') }}
          </h1>
        </div>

        <!-- Addresses List -->
        <div class="space-y-6">
          <div v-for="(address, index) in addresses" :key="index" class="bg-[#FAFAFA] p-6 rounded-lg">
            <div class="flex justify-between items-start mb-6">
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20s-7-5.5-7-10a7 7 0 0 1 14 0c0 4.5-7 10-7 10z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <h2 class="font-archivo-narrow font-semibold text-2xl">
                  {{ $t('addresses.address') }} {{ index + 1 }}
                </h2>
              </div>
              <button
                @click="removeAddress(index)"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Street -->
              <div class="md:col-span-2">
                <label class="block font-archivo text-sm mb-2">{{ $t('addresses.street') }}</label>
                <input 
                  type="text"
                  v-model="address.street"
                  :placeholder="$t('addresses.streetPlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                />
              </div>

              <!-- Number -->
              <div>
                <label class="block font-archivo text-sm mb-2">{{ $t('addresses.number') }}</label>
                <input 
                  type="text"
                  v-model="address.number"
                  :placeholder="$t('addresses.numberPlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                />
              </div>

              <!-- Complement -->
              <div>
                <label class="block font-archivo text-sm mb-2">{{ $t('addresses.complement') }}</label>
                <input 
                  type="text"
                  v-model="address.complement"
                  :placeholder="$t('addresses.complementPlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                />
              </div>

              <!-- Neighborhood -->
              <div>
                <label class="block font-archivo text-sm mb-2">{{ $t('addresses.neighborhood') }}</label>
                <input 
                  type="text"
                  v-model="address.neighborhood"
                  :placeholder="$t('addresses.neighborhoodPlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                />
              </div>

              <!-- City -->
              <div>
                <label class="block font-archivo text-sm mb-2">{{ $t('addresses.city') }}</label>
                <input 
                  type="text"
                  v-model="address.city"
                  :placeholder="$t('addresses.cityPlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                />
              </div>

              <!-- State -->
              <div>
                <label class="block font-archivo text-sm mb-2">{{ $t('addresses.state') }}</label>
                <input 
                  type="text"
                  v-model="address.state"
                  :placeholder="$t('addresses.statePlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                />
              </div>

              <!-- Postal Code -->
              <div>
                <label class="block font-archivo text-sm mb-2">{{ $t('addresses.postalCode') }}</label>
                <input 
                  type="text"
                  v-model="address.postalCode"
                  :placeholder="$t('addresses.postalCodePlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow"
                />
              </div>

              <!-- Default Address Checkbox -->
              <div class="md:col-span-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    :checked="address.isDefault"
                    @change="handleDefaultChange(index)"
                    class="form-checkbox text-empire-yellow rounded"
                  />
                  <span class="font-archivo text-sm">{{ $t('addresses.setAsDefault') }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Add New Address Button -->
          <button
            @click="addAddress"
            class="w-full bg-[#FAFAFA] p-4 rounded-lg border-2 border-dashed border-gray-300 text-empire-yellow hover:bg-gray-50 font-archivo"
          >
            + {{ $t('addresses.addNew') }}
          </button>

          <!-- Save Button -->
          <div class="flex justify-end mt-8">
            <button
              @click="saveAddresses"
              class="bg-empire-yellow text-black px-8 py-3 rounded-lg font-archivo hover:bg-empire-yellow/80"
              :disabled="saving"
            >
              {{ saving ? $t('profile.saving') : $t('profile.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

/* eslint-disable no-unused-vars */
const { t } = useI18n()
/* eslint-enable no-unused-vars */

const addresses = ref([
  {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  }
])

const saving = ref(false)

// Função para lidar com a mudança do endereço padrão
const handleDefaultChange = (changedIndex) => {
  addresses.value = addresses.value.map((address, index) => ({
    ...address,
    isDefault: index === changedIndex
  }))
}

const addAddress = () => {
  addresses.value.push({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  })
}

const removeAddress = (index) => {
  const removedAddress = addresses.value[index]
  addresses.value.splice(index, 1)
  
  // Se o endereço removido era o padrão e ainda existem outros endereços,
  // define o primeiro endereço como padrão
  if (removedAddress.isDefault && addresses.value.length > 0) {
    addresses.value[0].isDefault = true
  }
}

const saveAddresses = async () => {
  saving.value = true
  try {
    // Implement save logic here
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
    // Show success message or handle response
  } catch (error) {
    // Handle error
  } finally {
    saving.value = false
  }
}

// Garantir que sempre haja um endereço padrão se houver endereços cadastrados
watch(addresses, (newAddresses) => {
  if (newAddresses.length > 0 && !newAddresses.some(addr => addr.isDefault)) {
    newAddresses[0].isDefault = true
  }
}, { deep: true })
</script>

