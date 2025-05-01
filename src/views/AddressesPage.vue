<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-4 md:mb-8">
          <nav class="flex items-center gap-1 md:gap-2 font-archivo text-xs md:text-sm text-black/70">
            <router-link to="/" class="hover:text-black">{{ $t('breadcrumb.home') }}</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('addresses.title') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-4 md:mb-8">
          <h1 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-8 md:leading-[40px]">
            {{ $t('addresses.title') }}
          </h1>
        </div>

        <!-- Addresses List -->
        <div class="space-y-4 md:space-y-6">
          <div v-for="(address, index) in addresses" :key="index" class="bg-[#FAFAFA] p-4 md:p-6 rounded-lg">
            <div class="flex justify-between items-start mb-3 md:mb-6">
              <div class="flex items-center gap-2 md:gap-3">
                <svg class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20s-7-5.5-7-10a7 7 0 0 1 14 0c0 4.5-7 10-7 10z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <h2 class="font-archivo-narrow font-semibold text-xl md:text-2xl">
                  {{ $t('addresses.address') }} {{ index + 1 }}
                </h2>
              </div>
              <button
                @click="removeAddress(index)"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <!-- Street -->
              <div class="md:col-span-2">
                <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('addresses.street') }}</label>
                <input
                  type="text"
                  v-model="address.street"
                  :placeholder="$t('addresses.streetPlaceholder')"
                  :class="[
                    'w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none h-9 md:h-auto',
                    showErrors && !address.street ? 'border-red-500' : 'border-gray-300 focus:border-empire-yellow'
                  ]"
                />
                <span v-if="showErrors && !address.street" class="text-red-500 text-xs md:text-sm mt-1">
                  {{ $t('addresses.requiredField') }}
                </span>
              </div>

              <!-- Number -->
              <div>
                <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('addresses.number') }}</label>
                <input
                  type="text"
                  v-model="address.number"
                  :placeholder="$t('addresses.numberPlaceholder')"
                  :class="[
                    'w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none h-9 md:h-auto',
                    showErrors && !address.number ? 'border-red-500' : 'border-gray-300 focus:border-empire-yellow'
                  ]"
                />
                <span v-if="showErrors && !address.number" class="text-red-500 text-xs md:text-sm mt-1">
                  {{ $t('addresses.requiredField') }}
                </span>
              </div>

              <!-- Complement -->
              <div>
                <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('addresses.complement') }}</label>
                <input
                  type="text"
                  v-model="address.complement"
                  :placeholder="$t('addresses.complementPlaceholder')"
                  class="w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-empire-yellow h-9 md:h-auto"
                />
              </div>

              <!-- Neighborhood -->
              <div>
                <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('addresses.neighborhood') }}</label>
                <input
                  type="text"
                  v-model="address.neighborhood"
                  :placeholder="$t('addresses.neighborhoodPlaceholder')"
                  :class="[
                    'w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none h-9 md:h-auto',
                    showErrors && !address.neighborhood ? 'border-red-500' : 'border-gray-300 focus:border-empire-yellow'
                  ]"
                />
                <span v-if="showErrors && !address.neighborhood" class="text-red-500 text-xs md:text-sm mt-1">
                  {{ $t('addresses.requiredField') }}
                </span>
              </div>

              <!-- City -->
              <div>
                <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('addresses.city') }}</label>
                <input
                  type="text"
                  v-model="address.city"
                  :placeholder="$t('addresses.cityPlaceholder')"
                  :class="[
                    'w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none h-9 md:h-auto',
                    showErrors && !address.city ? 'border-red-500' : 'border-gray-300 focus:border-empire-yellow'
                  ]"
                />
                <span v-if="showErrors && !address.city" class="text-red-500 text-xs md:text-sm mt-1">
                  {{ $t('addresses.requiredField') }}
                </span>
              </div>

              <!-- State -->
              <div>
                <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('addresses.state') }}</label>
                <input
                  type="text"
                  v-model="address.state"
                  :placeholder="$t('addresses.statePlaceholder')"
                  :class="[
                    'w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none h-9 md:h-auto',
                    showErrors && !address.state ? 'border-red-500' : 'border-gray-300 focus:border-empire-yellow'
                  ]"
                />
                <span v-if="showErrors && !address.state" class="text-red-500 text-xs md:text-sm mt-1">
                  {{ $t('addresses.requiredField') }}
                </span>
              </div>

              <!-- Postal Code -->
              <div>
                <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">{{ $t('addresses.postalCode') }}</label>
                <input
                  type="text"
                  v-model="address.postalCode"
                  :placeholder="$t('addresses.postalCodePlaceholder')"
                  :class="[
                    'w-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none h-9 md:h-auto',
                    showErrors && !address.postalCode ? 'border-red-500' : 'border-gray-300 focus:border-empire-yellow'
                  ]"
                />
                <span v-if="showErrors && !address.postalCode" class="text-red-500 text-xs md:text-sm mt-1">
                  {{ $t('addresses.requiredField') }}
                </span>
              </div>

              <!-- Default Address Checkbox -->
              <div class="md:col-span-2">
                <label class="flex items-center gap-1 md:gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="address.isDefault"
                    @change="handleDefaultChange(index)"
                    class="form-checkbox text-empire-yellow rounded"
                  />
                  <span class="font-archivo text-xs md:text-sm">{{ $t('addresses.setAsDefault') }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Add New Address Button -->
          <button
            @click="addAddress"
            class="w-full bg-[#FAFAFA] p-3 md:p-4 rounded-lg border-2 border-dashed border-gray-300 text-empire-yellow hover:bg-gray-50 font-archivo text-sm md:text-base"
          >
            + {{ $t('addresses.addNew') }}
          </button>

          <!-- Save Button -->
          <div class="flex justify-end mt-4 md:mt-8">
            <button
              @click="saveAddresses"
              class="bg-empire-yellow text-black px-4 md:px-8 py-2 md:py-3 rounded-lg font-archivo hover:bg-empire-yellow/80 text-sm md:text-base"
              :disabled="saving"
            >
              {{ saving ? $t('profile.saving') : $t('profile.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação de Exclusão -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <div class="flex items-center justify-center h-full translate-y-[-10%]">
      <div class="bg-white rounded-xl p-4 md:p-8 max-w-md w-full mx-4 shadow-2xl">
        <!-- Header -->
        <div class="flex items-start justify-between mb-3 md:mb-6">
          <div class="flex items-center gap-2 md:gap-4">
            <div class="bg-red-100 rounded-full p-2 md:p-3">
              <svg
                class="w-5 h-5 md:w-6 md:h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg md:text-xl font-archivo-narrow font-semibold text-gray-900">
                {{ $t('addresses.deleteModal.title') }}
              </h3>
              <p class="mt-1 md:mt-2 text-xs md:text-sm text-gray-500">
                {{ $t('addresses.deleteModal.message') }}
              </p>
            </div>
          </div>
          <button
            @click="showDeleteModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Ações -->
        <div class="flex justify-end gap-2 md:gap-3 mt-4 md:mt-8 pt-3 md:pt-6 border-t border-gray-100">
          <button
            @click="showDeleteModal = false"
            class="px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-1 md:gap-2"
          >
            <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ $t('addresses.deleteModal.cancel') }}
          </button>
          <button
            @click="confirmDelete"
            class="px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-1 md:gap-2"
          >
            <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ $t('addresses.deleteModal.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const { t } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast
const router = useRouter()

const addresses = ref([])
const saving = ref(false)
const showErrors = ref(false)
const showDeleteModal = ref(false)
const addressToDelete = ref(null)

// Função para validar endereço
const validateAddress = (address) => {
  const requiredFields = [
    'street',
    'number',         // Adicionado como obrigatório
    'neighborhood',   // Adicionado como obrigatório
    'city',
    'state',
    'postalCode'
  ]
  return requiredFields.every(field => address[field]?.trim())
}

// Função para validar todos os endereços
const validateAddresses = () => {
  return addresses.value.every(validateAddress)
}

// Carregar endereços do usuário
const loadAddresses = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      throw new Error('User ID not found');
    }

    const response = await api.get(`/users/${user.id}/addresses`);
    addresses.value = response.data.map(addr => ({
      id: addr.id, // Garantir que o ID está sendo mapeado
      street: addr.address,
      number: addr.number,
      complement: addr.complement,
      neighborhood: addr.neighborhood,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country,
      isDefault: addr.is_default
    }));
  } catch (error) {
    console.error('Error loading addresses:', error);
    if (error.message === 'User ID not found') {
      toast.error('User session expired. Please login again.');
      router.push('/login');
    } else {
      toast.error(t('addresses.loadError'));
    }
  }
}

// Salvar endereços
const saveAddresses = async () => {
  showErrors.value = true  // Só mostra erros quando tentar salvar

  if (!validateAddresses()) {
    toast.error(t('addresses.fillAllRequired'))
    return
  }

  saving.value = true
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (!user.id) {
      throw new Error('User ID not found')
    }

    const formattedAddresses = addresses.value.map(addr => ({
      address: addr.street,
      number: addr.number,         // Adicionado
      complement: addr.complement,
      neighborhood: addr.neighborhood, // Adicionado
      city: addr.city,
      state: addr.state,
      postal_code: addr.postalCode,
      country: 'Canada',
      is_default: addr.isDefault
    }))

    await api.put(`/users/${user.id}/addresses`, formattedAddresses)
    toast.success(t('addresses.saveSuccess'))
  } catch (error) {
    console.error('Error saving addresses:', error)
    if (error.message === 'User ID not found') {
      toast.error('User session expired. Please login again.')
      router.push('/login')
    } else {
      toast.error(t('addresses.saveError'))
    }
  } finally {
    saving.value = false
  }
}

// Remover endereço
const removeAddress = (index) => {
  addressToDelete.value = index
  showDeleteModal.value = true
}

// Nova função para confirmar a exclusão
const confirmDelete = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      throw new Error('User ID not found');
    }

    const addressToRemove = addresses.value[addressToDelete.value];

    // Verificar se o endereço tem ID
    if (!addressToRemove.id) {
      // Se não tiver ID, apenas remove do array local
      addresses.value.splice(addressToDelete.value, 1);
    } else {
      // Se tiver ID, chama a API para remover
      await api.delete(`/users/${user.id}/addresses/${addressToRemove.id}`);
      addresses.value.splice(addressToDelete.value, 1);
    }

    if (addresses.value.length === 0) {
      addAddress();
    }

    toast.success(t('addresses.deleteSuccess'));
  } catch (error) {
    console.error('Error deleting address:', error);
    if (error.message === 'User ID not found') {
      toast.error('User session expired. Please login again.');
      router.push('/login');
    } else {
      toast.error(t('addresses.deleteError'));
    }
  } finally {
    showDeleteModal.value = false;
    addressToDelete.value = null;
  }
}

// Adicionar novo endereço
const addAddress = () => {
  showErrors.value = false  // Resetar os erros ao adicionar novo endereço
  addresses.value.push({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Canada',
    isDefault: addresses.value.length === 0
  })
}

// Lidar com mudança de endereço padrão
const handleDefaultChange = (changedIndex) => {
  addresses.value = addresses.value.map((address, index) => ({
    ...address,
    isDefault: index === changedIndex
  }))
}

onMounted(() => {
  loadAddresses()
})
</script>





















