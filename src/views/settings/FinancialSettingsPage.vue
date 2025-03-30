<!-- eslint-disable -->
<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { settingsService } from '@/services/settingsService'
import { authService } from '@/services/auth.service'
import { useFinancialTogglesStore } from '@/stores/financialTogglesStore'

const router = useRouter()
const { t } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

const formData = ref({
  tax_rate: '',
  min_order_value: '',
  free_shipping_threshold: '',
  currency_code: '',
  currency_symbol: '',
  shipping_cost: '',
  discount_percentage: ''
})

const loading = ref(false)
const error = ref(null)
const showErrors = ref(false)

// Refs para controle de perfil
const userProfile = ref(null)
const isAdmin = ref(false)
const isReadOnly = ref(true) // Manager pode apenas visualizar

// Classe CSS para campos desabilitados
const disabledFieldClass = 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-70 pointer-events-none'

// Classe CSS para toggles desabilitados mas ativos
const readOnlyActiveToggleClass = 'bg-gray-400 after:translate-x-full after:border-white opacity-60 pointer-events-none'

// Classe CSS para toggles desabilitados e inativos
const readOnlyInactiveToggleClass = 'bg-gray-200 after:translate-x-0 opacity-60 pointer-events-none'

// Carrega o perfil do usuário atual
const loadUserProfile = () => {
  const currentUser = authService.getCurrentUser()
  userProfile.value = currentUser?.profile || null
  console.log('User profile loaded:', userProfile.value)

  // Define se o usuário é admin ou não
  if (userProfile.value === 'ADMIN') {
    isAdmin.value = true
    isReadOnly.value = false
  } else {
    isAdmin.value = false
    isReadOnly.value = true
  }

  console.log('isAdmin:', isAdmin.value)
  console.log('isReadOnly:', isReadOnly.value)
}

// Usar o store Pinia para gerenciar os toggles
const togglesStore = useFinancialTogglesStore()

// Usar computed para acessar os valores do store
const masterToggle = computed({
  get: () => togglesStore.masterToggle,
  set: (value) => togglesStore.setMasterToggle(value)
})

// Usar computed para acessar os valores do store
const fieldToggles = computed(() => togglesStore.fieldToggles)

// Método para lidar diretamente com a mudança do toggle principal
const handleMasterToggleChange = () => {
  console.log('Master toggle changed directly by user to:', masterToggle.value)

  // Apenas se o usuário for um administrador
  if (isAdmin.value) {
    // Aplicar a mudança a todos os toggles individuais
    console.log('Applying change to all toggles:', masterToggle.value)
    togglesStore.setAllTogglesOnly(masterToggle.value)
  } else {
    // Se for MANAGER, restaura o estado original dos toggles
    togglesStore.restoreReadOnlyState()
  }
}

// Verifica se todos os toggles estão habilitados ou desabilitados
const updateMasterToggle = () => {
  // Apenas se o usuário for um administrador
  if (isAdmin.value) {
    console.log('Updating master toggle based on individual toggles')

    // Verifica diretamente se todos os toggles estão desabilitados
    const allDisabled = Object.values(togglesStore.fieldToggles).every(value => value === false)

    // Atualiza o masterToggle sem afetar os toggles individuais
    if (allDisabled) {
      console.log('All toggles are disabled, setting master toggle to false')
      masterToggle.value = false
    } else {
      console.log('Some toggles are enabled, setting master toggle to true')
      masterToggle.value = true
    }
  } else {
    // Para usuários MANAGER, não permitimos alterações nos toggles
    // Restauramos os valores originais
    togglesStore.restoreReadOnlyState()
  }
}

// Não precisamos mais observar mudanças nos toggles individuais
// porque estamos usando eventos de clique diretos

const loadFinancialSettings = async () => {
  loading.value = true
  error.value = null

  try {
    const settings = await settingsService.getFinancialSettings()
    console.log('Settings received:', settings)

    if (settings && settings.currency_code) {
      formData.value = {
        // Não multiplica mais por 100, mantém o valor como está
        tax_rate: settings.tax_rate ? parseFloat(settings.tax_rate).toFixed(2) : '0.00',
        min_order_value: settings.min_order_value ? parseFloat(settings.min_order_value).toFixed(2) : '0.00',
        free_shipping_threshold: settings.free_shipping_threshold ? parseFloat(settings.free_shipping_threshold).toFixed(2) : '0.00',
        shipping_cost: settings.shipping_cost ? parseFloat(settings.shipping_cost).toFixed(2) : '0.00',
        discount_percentage: settings.discount_percentage ? parseFloat(settings.discount_percentage).toFixed(2) : '0.00',
        currency_code: settings.currency_code,
        currency_symbol: settings.currency_symbol
      }
      console.log('FormData after update:', formData.value)

      // Carregar os estados dos toggles do backend
      togglesStore.loadTogglesFromBackend({
        currency_code_enabled: settings.currency_code_enabled,
        currency_symbol_enabled: settings.currency_symbol_enabled,
        tax_rate_enabled: settings.tax_rate_enabled,
        discount_percentage_enabled: settings.discount_percentage_enabled,
        min_order_value_enabled: settings.min_order_value_enabled,
        free_shipping_threshold_enabled: settings.free_shipping_threshold_enabled,
        shipping_cost_enabled: settings.shipping_cost_enabled,
        master_toggle_enabled: settings.master_toggle_enabled
      })

      // Atualiza o toggle principal
      updateMasterToggle()
    } else {
      throw new Error('Invalid settings data')
    }
  } catch (err) {
    console.error('Error loading financial settings:', err)
    error.value = err.message
    toast.error(t('financial.loadError'))
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  // Apenas administradores podem salvar alterações
  if (isReadOnly.value) {
    toast.error(t('financial.noPermission'))
    return
  }

  showErrors.value = true

  // Verifica apenas os campos obrigatórios que estão habilitados
  const requiredFields = ['tax_rate', 'currency_code', 'currency_symbol']
  const missingRequiredFields = requiredFields.filter(field =>
    fieldToggles.value[field] && !formData.value[field]
  )

  if (missingRequiredFields.length > 0) {
    toast.error(t('financial.requiredFieldsError'))
    return
  }

  loading.value = true
  error.value = null

  try {
    // Cria um objeto base com os valores atuais
    const baseData = {
      tax_rate: parseFloat(formData.value.tax_rate),
      min_order_value: parseFloat(formData.value.min_order_value) || 0,
      free_shipping_threshold: parseFloat(formData.value.free_shipping_threshold) || 0,
      shipping_cost: parseFloat(formData.value.shipping_cost) || 0,
      discount_percentage: parseFloat(formData.value.discount_percentage) || 0,
      currency_code: formData.value.currency_code,
      currency_symbol: formData.value.currency_symbol
    }

    // Filtra apenas os campos habilitados
    const dataToSubmit = {}
    Object.keys(baseData).forEach(key => {
      if (togglesStore.fieldToggles[key]) {
        dataToSubmit[key] = baseData[key]
      }
    })

    // Adiciona o estado dos toggles ao objeto a ser enviado
    const togglesData = togglesStore.prepareTogglesForSubmit()
    const finalData = { ...dataToSubmit, ...togglesData }

    await settingsService.updateFinancialSettings(finalData)
    toast.success(t('financial.updateSuccess'))
  } catch (err) {
    console.error('Error updating financial settings:', err)
    toast.error(t('financial.updateError'))
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/settings')
}

onMounted(() => {
  loadUserProfile() // Carrega o perfil do usuário primeiro
  loadFinancialSettings()
})
</script>

<template>
  <!-- eslint-disable vue/no-ref-as-operand -->
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">Home</router-link>
            <span>/</span>
            <router-link to="/settings" class="hover:text-black">
              {{ $t('systemSettings.title') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('systemSettings.financial') }}</span>
          </nav>
        </div>

        <!-- Form -->
        <div class="max-w-[754px] mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
              {{ $t('systemSettings.financial') }}
            </h1>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>

          <!-- Form content -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Read-only message for managers -->
            <div v-if="isReadOnly" class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">{{ $t('financial.readOnlyMode') }}</h3>
                  <div class="mt-2 text-sm text-yellow-700">
                    <p>{{ $t('financial.noPermission') }}</p>
                    <p class="mt-1">{{ $t('financial.viewOnlyAccess') }}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Master Toggle -->
            <div class="flex items-center justify-between p-4 bg-gray-100 rounded mb-6">
              <div>
                <h3 class="font-archivo-narrow font-semibold text-lg">{{ $t('financial.enableAllFields') }}</h3>
                <p class="text-sm text-gray-600">{{ $t('financial.enableAllFieldsDescription') }}</p>
              </div>
              <label :class="['relative inline-flex items-center', isAdmin ? 'cursor-pointer' : 'cursor-not-allowed']">
                <input
                  type="checkbox"
                  v-model="masterToggle"
                  class="sr-only peer"
                  :disabled="isReadOnly"
                  @change="handleMasterToggleChange"
                >
                <div :class="[
                  'w-11 h-6 rounded-full after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                  isReadOnly ? (masterToggle ? readOnlyActiveToggleClass : readOnlyInactiveToggleClass) : 'bg-gray-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-empire-yellow'
                ]"></div>
              </label>
            </div>
            <!-- Currency Code -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="font-archivo text-sm">{{ $t('financial.currencyCode') }}</label>
                <label :class="['relative inline-flex items-center', isAdmin ? 'cursor-pointer' : 'cursor-not-allowed']">
                  <input
                    type="checkbox"
                    v-model="fieldToggles.currency_code"
                    class="sr-only peer"
                    :disabled="isReadOnly"
                    @change="updateMasterToggle"
                  >
                  <div :class="[
                    'w-9 h-5 rounded-full after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all',
                    isReadOnly ? (fieldToggles.currency_code ? readOnlyActiveToggleClass : readOnlyInactiveToggleClass) : 'bg-gray-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-empire-yellow'
                  ]"></div>
                </label>
              </div>
              <input
                type="text"
                v-model="formData.currency_code"
                :placeholder="$t('financial.currencyCodePlaceholder')"
                :disabled="!fieldToggles.currency_code || isReadOnly"
                :readonly="isReadOnly"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.currency_code && fieldToggles.currency_code) ? 'border-red-500' : '',
                  !fieldToggles.currency_code ? 'bg-gray-100 text-gray-500' : '',
                  isReadOnly ? disabledFieldClass : ''
                ]"
                :aria-readonly="isReadOnly"
              >
              <span v-if="showErrors && !formData.currency_code && fieldToggles.currency_code" class="text-red-500 text-sm mt-1">
                {{ $t('financial.fieldRequired') }}
              </span>
            </div>

            <!-- Currency Symbol -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="font-archivo text-sm">{{ $t('financial.currencySymbol') }}</label>
                <label :class="['relative inline-flex items-center', isAdmin ? 'cursor-pointer' : 'cursor-not-allowed']">
                  <input
                    type="checkbox"
                    v-model="fieldToggles.currency_symbol"
                    class="sr-only peer"
                    :disabled="isReadOnly"
                    @change="updateMasterToggle"
                  >
                  <div :class="[
                    'w-9 h-5 rounded-full after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all',
                    isReadOnly ? (fieldToggles.currency_symbol ? readOnlyActiveToggleClass : readOnlyInactiveToggleClass) : 'bg-gray-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-empire-yellow'
                  ]"></div>
                </label>
              </div>
              <input
                type="text"
                v-model="formData.currency_symbol"
                :placeholder="$t('financial.currencySymbolPlaceholder')"
                :disabled="!fieldToggles.currency_symbol || isReadOnly"
                :readonly="isReadOnly"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.currency_symbol && fieldToggles.currency_symbol) ? 'border-red-500' : '',
                  !fieldToggles.currency_symbol ? 'bg-gray-100 text-gray-500' : '',
                  isReadOnly ? disabledFieldClass : ''
                ]"
              >
              <span v-if="showErrors && !formData.currency_symbol && fieldToggles.currency_symbol" class="text-red-500 text-sm mt-1">
                {{ $t('financial.fieldRequired') }}
              </span>
            </div>

            <!-- Tax Rate -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="font-archivo text-sm">{{ $t('financial.taxRate') }} (%)</label>
                <label :class="['relative inline-flex items-center', isAdmin ? 'cursor-pointer' : 'cursor-not-allowed']">
                  <input
                    type="checkbox"
                    v-model="fieldToggles.tax_rate"
                    class="sr-only peer"
                    :disabled="isReadOnly"
                    @change="updateMasterToggle"
                  >
                  <div :class="[
                    'w-9 h-5 rounded-full after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all',
                    isReadOnly ? (fieldToggles.tax_rate ? readOnlyActiveToggleClass : readOnlyInactiveToggleClass) : 'bg-gray-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-empire-yellow'
                  ]"></div>
                </label>
              </div>
              <input
                type="number"
                v-model="formData.tax_rate"
                step="0.01"
                min="0"
                max="100"
                :disabled="!fieldToggles.tax_rate || isReadOnly"
                :readonly="isReadOnly"
                :placeholder="$t('financial.taxRatePlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.tax_rate && fieldToggles.tax_rate) ? 'border-red-500' : '',
                  !fieldToggles.tax_rate ? 'bg-gray-100 text-gray-500' : '',
                  isReadOnly ? disabledFieldClass : ''
                ]"
              >
              <span v-if="showErrors && !formData.tax_rate && fieldToggles.tax_rate" class="text-red-500 text-sm mt-1">
                {{ $t('financial.fieldRequired') }}
              </span>
            </div>

            <!-- Discount Percentage -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="font-archivo text-sm">{{ $t('financial.discountPercentage') }} (%)</label>
                <label :class="['relative inline-flex items-center', isAdmin ? 'cursor-pointer' : 'cursor-not-allowed']">
                  <input
                    type="checkbox"
                    v-model="fieldToggles.discount_percentage"
                    class="sr-only peer"
                    :disabled="isReadOnly"
                    @change="updateMasterToggle"
                  >
                  <div :class="[
                    'w-9 h-5 rounded-full after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all',
                    isReadOnly ? (fieldToggles.discount_percentage ? readOnlyActiveToggleClass : readOnlyInactiveToggleClass) : 'bg-gray-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-empire-yellow'
                  ]"></div>
                </label>
              </div>
              <input
                type="number"
                v-model="formData.discount_percentage"
                step="0.01"
                min="0"
                max="100"
                :disabled="!fieldToggles.discount_percentage || isReadOnly"
                :readonly="isReadOnly"
                :placeholder="$t('financial.discountPercentagePlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  !fieldToggles.discount_percentage ? 'bg-gray-100 text-gray-500' : '',
                  isReadOnly ? disabledFieldClass : ''
                ]"
              >
            </div>

            <!-- Minimum Order Value -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="font-archivo text-sm">{{ $t('financial.minOrderValue') }}</label>
                <label :class="['relative inline-flex items-center', isAdmin ? 'cursor-pointer' : 'cursor-not-allowed']">
                  <input
                    type="checkbox"
                    v-model="fieldToggles.min_order_value"
                    class="sr-only peer"
                    :disabled="isReadOnly"
                    @change="updateMasterToggle"
                  >
                  <div :class="[
                    'w-9 h-5 rounded-full after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all',
                    isReadOnly ? (fieldToggles.min_order_value ? readOnlyActiveToggleClass : readOnlyInactiveToggleClass) : 'bg-gray-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-empire-yellow'
                  ]"></div>
                </label>
              </div>
              <input
                type="number"
                v-model="formData.min_order_value"
                step="0.01"
                min="0"
                :disabled="!fieldToggles.min_order_value || isReadOnly"
                :readonly="isReadOnly"
                :placeholder="$t('financial.minOrderValuePlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  !fieldToggles.min_order_value ? 'bg-gray-100 text-gray-500' : '',
                  isReadOnly ? disabledFieldClass : ''
                ]"
              >
            </div>

            <!-- Free Shipping Threshold -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="font-archivo text-sm">{{ $t('financial.freeShippingThreshold') }}</label>
                <label :class="['relative inline-flex items-center', isAdmin ? 'cursor-pointer' : 'cursor-not-allowed']">
                  <input
                    type="checkbox"
                    v-model="fieldToggles.free_shipping_threshold"
                    class="sr-only peer"
                    :disabled="isReadOnly"
                    @change="updateMasterToggle"
                  >
                  <div :class="[
                    'w-9 h-5 rounded-full after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all',
                    isReadOnly ? (fieldToggles.free_shipping_threshold ? readOnlyActiveToggleClass : readOnlyInactiveToggleClass) : 'bg-gray-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-empire-yellow'
                  ]"></div>
                </label>
              </div>
              <input
                type="number"
                v-model="formData.free_shipping_threshold"
                step="0.01"
                min="0"
                :disabled="!fieldToggles.free_shipping_threshold || isReadOnly"
                :readonly="isReadOnly"
                :placeholder="$t('financial.freeShippingThresholdPlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  !fieldToggles.free_shipping_threshold ? 'bg-gray-100 text-gray-500' : '',
                  isReadOnly ? disabledFieldClass : ''
                ]"
              >
            </div>

            <!-- Shipping Cost -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="font-archivo text-sm">{{ $t('financial.shippingCost') }}</label>
                <label :class="['relative inline-flex items-center', isAdmin ? 'cursor-pointer' : 'cursor-not-allowed']">
                  <input
                    type="checkbox"
                    v-model="fieldToggles.shipping_cost"
                    class="sr-only peer"
                    :disabled="isReadOnly"
                    @change="updateMasterToggle"
                  >
                  <div :class="[
                    'w-9 h-5 rounded-full after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all',
                    isReadOnly ? (fieldToggles.shipping_cost ? readOnlyActiveToggleClass : readOnlyInactiveToggleClass) : 'bg-gray-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-empire-yellow'
                  ]"></div>
                </label>
              </div>
              <input
                type="number"
                v-model="formData.shipping_cost"
                step="0.01"
                min="0"
                :disabled="!fieldToggles.shipping_cost || isReadOnly"
                :readonly="isReadOnly"
                :placeholder="$t('financial.shippingCostPlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  !fieldToggles.shipping_cost ? 'bg-gray-100 text-gray-500' : '',
                  isReadOnly ? disabledFieldClass : ''
                ]"
              >
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 mt-8">
              <button
                type="submit"
                :class="[
                  'flex-1 font-archivo font-semibold py-4 px-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  isAdmin ? 'bg-empire-yellow text-black hover:bg-yellow-400' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
                :disabled="loading || isReadOnly"
                :title="isReadOnly ? $t('financial.noPermissionToSave') : ''"
              >
                {{ loading ? $t('common.saving') : $t('common.save') }}
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
    <!-- Debug info - remover após resolver o problema -->
    <pre v-if="error" class="text-red-500 mt-4">{{ error }}</pre>
  </div>
</template>













