<template>
  <div class="min-h-screen bg-white text-black">
    <div class="mx-auto px-4 md:px-8 py-12 md:py-20 max-w-[1408px]">
      <h1 class="font-archivo-narrow text-4xl md:text-5xl text-black text-center mb-12">
        {{ $t('history.title') }}
      </h1>

      <div v-if="loading" class="text-center">
        {{ $t('history.loading') }}
      </div>

      <div v-else-if="error" class="text-center text-red-600">
        {{ error }}
      </div>

      <div v-else class="space-y-8">
        <div
          v-for="item in localizedHistoryItems"
          :key="item.id"
          class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg"
        >
          <h2 class="font-archivo-narrow text-2xl text-black mb-4">{{ item.title }}</h2>
          <p class="text-black whitespace-pre-wrap">{{ item.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const { t, locale } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

const loading = ref(false)
const error = ref(null)
const historyItems = ref([])

// Computed property para items localizados
const localizedHistoryItems = computed(() => {
  return historyItems.value.map(item => ({
    ...item,
    title: item[`title_${locale.value}`] || item.title_en || item.title,
    content: item[`content_${locale.value}`] || item.content_en || item.content
  }))
})

const fetchHistory = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get('/settings/history')
    historyItems.value = response.data
  } catch (err) {
    console.error('Error fetching history:', err)
    error.value = t('history.fetchError')
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
/* Mantenha os estilos existentes inalterados */
</style>




