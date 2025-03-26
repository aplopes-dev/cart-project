<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { settingsService } from '@/services/settingsService'

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
  shipping_cost: ''
})

const loading = ref(false)
const error = ref(null)
const showErrors = ref(false)

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
        currency_code: settings.currency_code,
        currency_symbol: settings.currency_symbol
      }
      console.log('FormData after update:', formData.value)
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
  showErrors.value = true

  if (!formData.value.tax_rate || !formData.value.currency_code || !formData.value.currency_symbol) {
    toast.error(t('financial.requiredFieldsError'))
    return
  }

  loading.value = true
  error.value = null

  try {
    const dataToSubmit = {
      // Envia a tax_rate como está, sem dividir por 100
      tax_rate: parseFloat(formData.value.tax_rate),
      min_order_value: parseFloat(formData.value.min_order_value) || 0,
      free_shipping_threshold: parseFloat(formData.value.free_shipping_threshold) || 0,
      shipping_cost: parseFloat(formData.value.shipping_cost) || 0,
      currency_code: formData.value.currency_code,
      currency_symbol: formData.value.currency_symbol
    }
    
    await settingsService.updateFinancialSettings(dataToSubmit)
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
  loadFinancialSettings()
})
</script>

<template>
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
            <!-- Currency Code -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('financial.currencyCode') }}</label>
              <input 
                type="text"
                v-model="formData.currency_code"
                :placeholder="$t('financial.currencyCodePlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.currency_code) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.currency_code" class="text-red-500 text-sm mt-1">
                {{ $t('financial.fieldRequired') }}
              </span>
            </div>

            <!-- Currency Symbol -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('financial.currencySymbol') }}</label>
              <input 
                type="text"
                v-model="formData.currency_symbol"
                :placeholder="$t('financial.currencySymbolPlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.currency_symbol) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.currency_symbol" class="text-red-500 text-sm mt-1">
                {{ $t('financial.fieldRequired') }}
              </span>
            </div>

            <!-- Tax Rate -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('financial.taxRate') }} (%)</label>
              <input 
                type="number"
                v-model="formData.tax_rate"
                step="0.01"
                min="0"
                max="100"
                :placeholder="$t('financial.taxRatePlaceholder')"
                :class="[
                  'w-full p-4 border border-gray-300',
                  (showErrors && !formData.tax_rate) ? 'border-red-500' : ''
                ]"
              >
              <span v-if="showErrors && !formData.tax_rate" class="text-red-500 text-sm mt-1">
                {{ $t('financial.fieldRequired') }}
              </span>
            </div>

            <!-- Minimum Order Value -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('financial.minOrderValue') }}</label>
              <input 
                type="number"
                v-model="formData.min_order_value"
                step="0.01"
                min="0"
                :placeholder="$t('financial.minOrderValuePlaceholder')"
                class="w-full p-4 border border-gray-300"
              >
            </div>

            <!-- Free Shipping Threshold -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('financial.freeShippingThreshold') }}</label>
              <input 
                type="number"
                v-model="formData.free_shipping_threshold"
                step="0.01"
                min="0"
                :placeholder="$t('financial.freeShippingThresholdPlaceholder')"
                class="w-full p-4 border border-gray-300"
              >
            </div>

            <!-- Shipping Cost -->
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('financial.shippingCost') }}</label>
              <input 
                type="number"
                v-model="formData.shipping_cost"
                step="0.01"
                min="0"
                :placeholder="$t('financial.shippingCostPlaceholder')"
                class="w-full p-4 border border-gray-300"
              >
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 mt-8">
              <button
                type="submit"
                class="flex-1 bg-empire-yellow text-black font-archivo font-semibold py-4 px-8 hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading"
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













