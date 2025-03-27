<template>
  <div class="min-h-screen bg-white text-black">
    <div class="mx-auto px-4 md:px-8 py-12 md:py-20 max-w-[1408px]">
      <h1 class="font-archivo-narrow text-4xl md:text-5xl text-black text-center mb-12">{{ $t('career.title') }}</h1>

      <div v-if="loading" class="text-center">
        {{ $t('career.loading') }}
      </div>

      <div v-else-if="error" class="text-center text-red-600">
        {{ error }}
      </div>

      <div v-else class="space-y-8">
        <div class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg">
          <h2 class="font-archivo-narrow text-2xl text-black mb-4">{{ $t('career.whyJoin.title') }}</h2>
          <ul class="list-disc list-inside text-black space-y-2">
            <li>{{ $t('career.whyJoin.benefit1') }}</li>
            <li>{{ $t('career.whyJoin.benefit2') }}</li>
            <li>{{ $t('career.whyJoin.benefit3') }}</li>
            <li>{{ $t('career.whyJoin.benefit4') }}</li>
          </ul>
        </div>

        <div class="space-y-6">
          <h2 class="font-archivo-narrow text-2xl text-empire-yellow">{{ $t('career.openings.title') }}</h2>
          
          <div v-for="position in activeCareerItems" :key="position.id" 
               class="bg-black/30 p-6 md:p-8 rounded-lg">
            <h3 class="font-archivo-narrow text-xl text-empire-yellow mb-2">{{ position.title }}</h3>
            <p class="text-empire-white-70 mb-4 whitespace-pre-wrap">{{ position.content }}</p>
            <button 
              @click="applyForPosition(position.title)"
              class="bg-empire-yellow text-black px-6 py-2 rounded-full hover:bg-empire-yellow/90 transition-colors"
            >
              {{ $t('career.apply') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const { t } = useI18n()
const router = useRouter()
const loading = ref(false)
const error = ref(null)
const careerItems = ref([])

// Computed property para filtrar apenas os itens ativos
const activeCareerItems = computed(() => {
  return careerItems.value.filter(item => item.is_active)
})

// Função para buscar as vagas
const fetchCareers = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get('/settings/careers')
    careerItems.value = response.data
  } catch (err) {
    console.error('Error fetching careers:', err)
    error.value = t('career.fetchError')
  } finally {
    loading.value = false
  }
}

// Função para aplicar para uma vaga
const applyForPosition = (positionTitle) => {
  router.push({
    path: '/contact',
    query: {
      subject: 'job_application',
      position: positionTitle
    }
  })
}

onMounted(() => {
  fetchCareers()
})
</script>


