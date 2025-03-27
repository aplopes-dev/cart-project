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
            <router-link to="/settings/content" class="hover:text-black">
              {{ $t('systemSettings.content') }}
            </router-link>
            <span>/</span>
            <span class="text-black">{{ $t('content.history.breadcrumb') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('content.history.title') }}
          </h1>         
        </div>

        <!-- Form -->
        <div class="bg-[#FAFAFA] p-8 mb-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.history.form.title') }}</label>
              <input 
                type="text"
                v-model="formData.title"
                class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none"
                :placeholder="$t('content.history.form.titlePlaceholder')"
              />
            </div>

            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.history.form.content') }}</label>
              <textarea 
                v-model="formData.content"
                rows="4"
                class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none resize-none"
                :placeholder="$t('content.history.form.contentPlaceholder')"
              ></textarea>
            </div>

            <div class="flex justify-end gap-4">
              <button 
                v-if="editingId"
                type="button"
                @click="cancelEdit"
                class="bg-gray-200 text-black px-8 py-3 font-archivo-narrow text-lg hover:opacity-90 transition-opacity"
              >
                {{ $t('content.history.form.cancel') }}
              </button>
              <button 
                type="submit"
                class="bg-black text-empire-yellow px-8 py-3 font-archivo-narrow text-lg hover:opacity-90 transition-opacity"
              >
                {{ $t(editingId ? 'content.history.form.edit' : 'content.history.form.add') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Cards -->
        <div class="space-y-6">
          <div 
            v-for="(item, index) in historyItems" 
            :key="index"
            class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg relative"
            :class="{ 'opacity-50': !item.is_active }"
          >
            <!-- Botões de ação -->
            <div class="absolute top-4 right-4 flex gap-4">
              <button 
                @click="toggleVisibility(index)"
                class="hover:opacity-70 transition-opacity"
                :title="$t(item.is_active ? 'content.history.actions.hide' : 'content.history.actions.show')"
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
                :title="$t('content.history.actions.edit')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              <button 
                @click="deleteItem(index)"
                class="hover:opacity-70 transition-opacity"
                :title="$t('content.history.actions.delete')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>

            <h2 class="font-archivo-narrow text-2xl text-black mb-4">{{ item.title }}</h2>
            <p class="text-black whitespace-pre-wrap">{{ item.content }}</p>
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
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
      <h3 class="font-archivo-narrow text-2xl mb-4">
        {{ $t('content.history.deleteModal.title') }}
      </h3>
      <p class="text-black/70 mb-8">
        {{ $t('content.history.deleteModal.message') }}
      </p>
      <div class="flex justify-end gap-4">
        <button 
          @click="showDeleteModal = false"
          class="bg-gray-200 text-black px-6 py-2 rounded font-archivo-narrow hover:opacity-90 transition-opacity"
        >
          {{ $t('content.history.deleteModal.cancel') }}
        </button>
        <button 
          @click="confirmDelete"
          class="bg-red-600 text-white px-6 py-2 rounded font-archivo-narrow hover:opacity-90 transition-opacity"
        >
          {{ $t('content.history.deleteModal.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
/* eslint-disable */
import { useRouter } from 'vue-router'
/* eslint-enable */
import api from '@/services/api'

const { t } = useI18n()
// eslint-disable-next-line no-unused-vars
const router = useRouter()
const app = getCurrentInstance()
const toast = app.appContext.config.globalProperties.$toast

const loading = ref(false)
const error = ref(null)
const historyItems = ref([])
const editingId = ref(null) // Adicionando a definição do editingId
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

const formData = ref({
  title: '',
  content: '',
  is_active: true,
  type: 'history'
})

// Função para resetar o formulário
const resetForm = () => {
  formData.value = {
    title: '',
    content: '',
    is_active: true,
    type: 'history'
  }
  editingId.value = null
}

// Função para carregar os itens do histórico
const loadHistoryItems = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get('/settings/history')
    historyItems.value = response.data
  } catch (err) {
    console.error('Error:', err)
    error.value = t('content.history.messages.loadError')
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Função para adicionar novo item ou atualizar existente
const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    if (editingId.value) {
      // Atualizar item existente
      await api.put(`/settings/history/${editingId.value}`, formData.value)
      toast.success(t('content.history.messages.updateSuccess'))
    } else {
      // Adicionar novo item
      await api.post('/settings/history', formData.value)
      toast.success(t('content.history.messages.addSuccess'))
    }
    await loadHistoryItems()
    resetForm()
  } catch (err) {
    console.error('Error:', err)
    error.value = t(editingId.value ? 'content.history.messages.updateError' : 'content.history.messages.addError')
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Função para editar item
const editItem = (index) => {
  const item = historyItems.value[index]
  editingId.value = item.id
  formData.value = {
    title: item.title,
    content: item.content,
    is_active: item.is_active,
    type: 'history'
  }
}

// Função para cancelar edição
const cancelEdit = () => {
  resetForm()
}

// Função para alternar visibilidade
const toggleVisibility = async (index) => {
  const item = historyItems.value[index]
  try {
    await api.put(`/settings/history/${item.id}`, {
      ...item,
      is_active: !item.is_active,
      type: 'history'
    })
    await loadHistoryItems()
    toast.success(t('content.history.messages.visibilitySuccess'))
  } catch (err) {
    console.error('Error:', err)
    toast.error(t('content.history.messages.visibilityError'))
  }
}

// Função para abrir o modal de confirmação
const deleteItem = (index) => {
  itemToDelete.value = historyItems.value[index]
  showDeleteModal.value = true
}

// Função para confirmar e executar a exclusão
const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await api.delete(`/settings/history/${itemToDelete.value.id}`)
    await loadHistoryItems()
    toast.success(t('content.history.messages.deleteSuccess'))
  } catch (err) {
    console.error('Error:', err)
    toast.error(t('content.history.messages.deleteError'))
  } finally {
    showDeleteModal.value = false
    itemToDelete.value = null
  }
}

onMounted(() => {
  loadHistoryItems()
})
</script>

<style scoped>
/* Mantenha os estilos existentes inalterados */
</style>













