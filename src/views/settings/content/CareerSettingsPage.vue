<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1408px] mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 font-archivo text-sm text-black/70">
            <router-link to="/" class="hover:text-black">{{ $t('breadcrumb.home') }}</router-link>
            <span>/</span>
            <router-link to="/my-account" class="hover:text-black">
              {{ $t('myAccount.title') }}
            </router-link>
            <span>/</span>
            <router-link to="/settings" class="hover:text-black">
              {{ $t('systemSettings.title') }}
            </router-link>
            <span>/</span>
            <router-link to="/settings/content" class="hover:text-black">
              {{ $t('systemSettings.content') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('content.career.breadcrumb') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h1 class="font-archivo-narrow font-semibold text-2xl md:text-[34px] leading-8 md:leading-[40px]">
            {{ $t('content.career.title') }}
          </h1>
        </div>

        <!-- Form -->
        <div class="bg-[#FAFAFA] p-4 md:p-8 mb-6 md:mb-8">
          <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
            <!-- Campos para cada idioma -->
            <div v-for="lang in availableLanguages" :key="lang" class="space-y-3 md:space-y-4">
              <h3 class="font-archivo-narrow font-semibold text-base md:text-lg">
                {{ lang.toUpperCase() }}
              </h3>

              <div>
                <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">
                  {{ $t('content.career.form.title') }} ({{ lang.toUpperCase() }})
                </label>
                <input
                  type="text"
                  v-model="formData[`title_${lang}`]"
                  class="w-full p-3 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-white focus:border-empire-yellow focus:outline-none h-10 md:h-auto"
                  :placeholder="$t('content.career.form.titlePlaceholder')"
                />
              </div>

              <div>
                <label class="block font-archivo text-xs md:text-sm mb-1 md:mb-2">
                  {{ $t('content.career.form.content') }} ({{ lang.toUpperCase() }})
                </label>
                <textarea
                  v-model="formData[`content_${lang}`]"
                  rows="3" md:rows="4"
                  class="w-full p-3 md:p-4 border-2 border-black/25 rounded font-archivo text-sm md:text-base bg-white focus:border-empire-yellow focus:outline-none resize-none"
                  :placeholder="$t('content.career.form.contentPlaceholder')"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-2 md:gap-4">
              <button
                v-if="editingId"
                type="button"
                @click="cancelEdit"
                class="px-3 md:px-6 py-1.5 md:py-2 border-2 border-black/25 rounded font-archivo text-sm md:text-base"
              >
                {{ $t('content.career.form.cancel') }}
              </button>
              <button
                type="submit"
                class="px-3 md:px-6 py-1.5 md:py-2 bg-empire-yellow text-black rounded font-archivo hover:opacity-90 text-sm md:text-base"
              >
                {{ $t(editingId ? 'content.career.form.edit' : 'content.career.form.add') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Cards -->
        <div class="space-y-6">
          <div
            v-for="(item, index) in localizedCareerItems"
            :key="index"
            class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg relative"
            :class="{ 'opacity-50': !item.is_active }"
          >
            <!-- Botões de ação -->
            <div class="absolute top-4 right-4 flex gap-4">
              <button
                @click="toggleVisibility(index)"
                class="hover:opacity-70 transition-opacity"
                :title="$t(item.is_active ? 'content.career.actions.hide' : 'content.career.actions.show')"
              >
                <svg
                  class="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    v-if="item.is_active"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-if="item.is_active"
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
                  />
                  <path
                    v-else
                    d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                  />
                  <line
                    v-if="!item.is_active"
                    x1="1"
                    y1="1"
                    x2="23"
                    y2="23"
                  />
                </svg>
              </button>

              <button
                @click="editItem(index)"
                class="hover:opacity-70 transition-opacity"
                :title="$t('content.career.actions.edit')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              <button
                @click="deleteItem(index)"
                class="hover:opacity-70 transition-opacity"
                :title="$t('content.career.actions.delete')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>

            <h3 class="font-archivo-narrow font-semibold text-lg md:text-xl mb-2 md:mb-4">
              {{ item.title }}
            </h3>
            <p class="font-archivo text-sm md:text-base text-black/70">
              {{ item.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-4 md:p-8 max-w-md w-full mx-4">
      <h3 class="text-lg md:text-xl font-archivo-narrow mb-3 md:mb-4">{{ $t('content.career.modal.deleteTitle') }}</h3>
      <p class="text-black/70 mb-4 md:mb-6 text-sm md:text-base">{{ $t('content.career.modal.deleteMessage') }}</p>
      <div class="flex justify-end gap-2 md:gap-4">
        <button
          @click="showDeleteModal = false"
          class="px-3 md:px-6 py-1.5 md:py-2 text-black/70 hover:text-black text-sm md:text-base"
        >
          {{ $t('content.career.modal.cancel') }}
        </button>
        <button
          @click="confirmDelete"
          class="px-3 md:px-6 py-1.5 md:py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm md:text-base"
        >
          {{ $t('content.career.modal.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'

const { t, locale } = useI18n()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

const loading = ref(false)
const error = ref(null)
const careerItems = ref([])
const editingId = ref(null)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

// Adicione a lista de idiomas disponíveis
// Temporariamente removido PT do array de idiomas disponíveis
// Quando quiser reativar, basta adicionar 'pt' de volta ao array
const availableLanguages = ['fr', 'en']

// Atualize o formData para incluir campos multilíngues
const formData = ref({
  title_fr: '',
  content_fr: '',
  title_en: '',
  content_en: '',
  title_pt: '',
  content_pt: '',
  is_active: true,
  type: 'career'
})

const resetForm = () => {
  formData.value = {
    title_fr: '',
    content_fr: '',
    title_en: '',
    content_en: '',
    title_pt: '',
    content_pt: '',
    is_active: true,
    type: 'career'
  }
  editingId.value = null
}

const loadCareerItems = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get('/settings/careers')
    careerItems.value = response.data
  } catch (err) {
    console.error('Error:', err)
    error.value = t('content.career.messages.loadError')
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    if (editingId.value) {
      await api.put(`/settings/careers/${editingId.value}`, formData.value)
      toast.success(t('content.career.messages.updateSuccess'))
    } else {
      await api.post('/settings/careers', formData.value)
      toast.success(t('content.career.messages.addSuccess'))
    }
    await loadCareerItems()
    resetForm()
  } catch (err) {
    console.error('Error:', err)
    error.value = t(editingId.value ? 'content.career.messages.updateError' : 'content.career.messages.addError')
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const editItem = (index) => {
  const item = careerItems.value[index]
  editingId.value = item.id
  formData.value = {
    title_fr: item.title_fr || '',
    content_fr: item.content_fr || '',
    title_en: item.title_en || '',
    content_en: item.content_en || '',
    title_pt: item.title_pt || '',
    content_pt: item.content_pt || '',
    is_active: item.is_active,
    type: 'career'
  }
}

const cancelEdit = () => {
  resetForm()
}

const toggleVisibility = async (index) => {
  const item = careerItems.value[index]
  try {
    await api.put(`/settings/careers/${item.id}`, {
      ...item,
      is_active: !item.is_active,
      type: 'career'
    })
    await loadCareerItems()
    toast.success(t('content.career.messages.visibilitySuccess'))
  } catch (err) {
    console.error('Error:', err)
    toast.error(t('content.career.messages.visibilityError'))
  }
}

const deleteItem = (index) => {
  itemToDelete.value = careerItems.value[index]
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await api.delete(`/settings/careers/${itemToDelete.value.id}`)
    await loadCareerItems()
    toast.success(t('content.career.messages.deleteSuccess'))
  } catch (err) {
    console.error('Error:', err)
    toast.error(t('content.career.messages.deleteError'))
  } finally {
    showDeleteModal.value = false
    itemToDelete.value = null
  }
}

onMounted(() => {
  loadCareerItems()
})

// Computed property para items localizados
const localizedCareerItems = computed(() => {
  return careerItems.value.map(item => ({
    ...item,
    title: item[`title_${locale.value}`] || item.title_en || item.title,
    content: item[`content_${locale.value}`] || item.content_en || item.content
  }))
})
</script>



