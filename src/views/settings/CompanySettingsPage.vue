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
            <router-link to="/settings" class="hover:text-black">
              {{ $t('systemSettings.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('systemSettings.company') }}</span>
          </nav>
        </div>

        <!-- Form -->
        <div class="max-w-[754px] mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
              {{ $t('systemSettings.company') }}
            </h1>
          </div>

          <!-- Loading state -->
          <div v-if="loading && !formData.name" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>

          <!-- Form content -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Nome da Empresa -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('company.name') }}</label>
              <input 
                type="text"
                v-model="formData.name"
                :placeholder="$t('company.namePlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.name) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.name" class="text-red-500 text-sm mt-1">
                {{ $t('company.fieldRequired') }}
              </span>
            </div>

            <!-- Email -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('company.email') }}</label>
              <input 
                type="email"
                v-model="formData.email"
                :placeholder="$t('company.emailPlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.email) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.email" class="text-red-500 text-sm mt-1">
                {{ $t('company.fieldRequired') }}
              </span>
            </div>

            <!-- Telefone -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('company.phone') }}</label>
              <input 
                type="tel"
                v-model="formData.phone"
                :placeholder="$t('company.phonePlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.phone) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.phone" class="text-red-500 text-sm mt-1">
                {{ $t('company.fieldRequired') }}
              </span>
            </div>

            <!-- Endereço -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('company.address') }}</label>
              <input 
                type="text"
                v-model="formData.address"
                :placeholder="$t('company.addressPlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.address) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.address" class="text-red-500 text-sm mt-1">
                {{ $t('company.fieldRequired') }}
              </span>
            </div>

            <!-- Botões -->
            <div class="flex gap-4 mt-8">
              <button
                type="submit"
                class="flex-1 bg-empire-yellow text-black font-archivo font-semibold py-4 px-8 hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading"
              >
                {{ loading ? $t('company.saving') : $t('company.save') }}
              </button>
              <button
                type="button"
                @click="goBack"
                class="flex-1 bg-gray-200 text-black font-archivo font-semibold py-4 px-8 hover:bg-gray-300 transition-colors"
              >
                {{ $t('common.cancel') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getCurrentInstance } from 'vue'
import api from '@/services/api'
import eventBus from '@/utils/eventBus'

const router = useRouter()
const { t } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const loading = ref(false)
const error = ref(null)
const showErrors = ref(false)

// Função para carregar os dados da empresa
const loadCompanyData = async () => {
  try {
    const response = await api.get('/settings/company')
    formData.value = {
      name: response.data.company_name || '',
      email: response.data.email || '',
      phone: response.data.phone || '',
      address: response.data.address || ''
    }
  } catch (err) {
    console.error('Error loading company data:', err)
    toast.error(t('company.loadError'))
  }
}

const handleSubmit = async () => {
  showErrors.value = true

  if (!formData.value.name || !formData.value.email || !formData.value.phone || !formData.value.address) {
    toast.error(t('company.requiredFieldsError'))
    return
  }

  loading.value = true
  error.value = null

  try {
    const dataToSubmit = {
      company_name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      address: formData.value.address
    }
    
    await api.put('/settings/company', dataToSubmit)
    toast.success(t('company.updateSuccess'))
    console.log('Emitting company-data-updated event') // Debug log
    eventBus.emit('company-data-updated')
  } catch (err) {
    console.error('Error updating company settings:', err)
    toast.error(t('company.updateError'))
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/settings')
}

// Carregar dados ao montar o componente
onMounted(() => {
  loadCompanyData()
})
</script>








