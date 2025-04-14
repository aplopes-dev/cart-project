<template>
  <div class="min-h-screen bg-white text-black">
    <div class="mx-auto px-4 md:px-8 py-12 md:py-20 max-w-[1408px]">
      <h1 class="font-archivo-narrow text-4xl md:text-5xl text-black text-center mb-12">
        {{ $t('suppliers.pageTitle') }}
      </h1>

      <div v-if="loading" class="text-center">
        {{ $t('common.loading') }}
      </div>
      
      <div v-else-if="error" class="text-center text-red-600">
        {{ error }}
      </div>

      <div v-else-if="activeSuppliers.length === 0" class="text-center text-gray-600">
        Nenhum fornecedor encontrado.
      </div>

      <div v-else class="space-y-8">
        <div 
          v-for="supplier in activeSuppliers" 
          :key="supplier.id" 
          class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg"
        >
          <h2 class="font-archivo-narrow text-2xl text-black mb-4">
            {{ supplier.title }}
          </h2>
          <p class="text-black whitespace-pre-wrap">
            {{ supplier.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

export default {
  name: 'SuppliersView',
  setup() {
    const { locale } = useI18n()
    const suppliers = ref([])
    const loading = ref(false)
    const error = ref(null)

    const localizedSuppliers = computed(() => {
      return suppliers.value.map(supplier => ({
        ...supplier,
        title: supplier[`title_${locale.value}`] || supplier.title_en || supplier.title,
        content: supplier[`content_${locale.value}`] || supplier.content_en || supplier.content
      }))
    })

    const activeSuppliers = computed(() => {
      return localizedSuppliers.value.filter(supplier => supplier.is_active)
    })

    const fetchSuppliers = async () => {
      loading.value = true
      error.value = null
      
      try {
        const response = await api.get('/settings/suppliers')
        
        if (!response.data) {
          throw new Error('No data received from API')
        }

        suppliers.value = Array.isArray(response.data) ? response.data : []
      } catch (err) {
        error.value = err.message || 'Error loading suppliers'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchSuppliers()
    })

    return {
      suppliers,
      activeSuppliers,
      loading,
      error
    }
  }
}
</script>


