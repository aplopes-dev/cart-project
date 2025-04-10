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
            <span class="text-black">{{ $t('content.homeImages.breadcrumb') }}</span>
          </nav>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-archivo-narrow font-semibold text-[34px] leading-[40px]">
            {{ $t('content.homeImages.title') }}
          </h1>         
        </div>

        <!-- Form -->
        <div class="bg-[#FAFAFA] p-8 mb-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.homeImages.form.title') }}</label>
              <input 
                type="text"
                v-model="formData.title"
                class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none"
                :placeholder="$t('content.homeImages.form.titlePlaceholder')"
              />
            </div>

            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.homeImages.form.description') }}</label>
              <textarea 
                v-model="formData.description"
                rows="4"
                class="w-full p-4 border-2 border-black/25 rounded font-archivo text-base bg-white focus:border-empire-yellow focus:outline-none resize-none"
                :placeholder="$t('content.homeImages.form.descriptionPlaceholder')"
              ></textarea>
            </div>

            <div>
              <label class="block font-archivo text-sm mb-2">{{ $t('content.homeImages.form.image') }}</label>
              <div class="relative">
                <input 
                  type="file"
                  @change="handleImageUpload"
                  accept="image/*"
                  class="hidden"
                  ref="fileInput"
                />
                <div class="flex items-center gap-3">
                  <button 
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    {{ $t('content.homeImages.form.chooseFileButton') }}
                  </button>
                  <span class="text-gray-600">
                    {{ selectedFileName || $t('content.homeImages.form.noFileSelected') }}
                  </span>
                  <!-- Botão para remover imagem -->
                  <button 
                    v-if="selectedFileName"
                    type="button"
                    @click="removeSelectedImage"
                    class="hover:opacity-70 transition-opacity p-1 rounded-full"
                    :title="$t('content.homeImages.form.removeImage')"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-black/50 mt-2">{{ $t('content.homeImages.form.imageHint') }}</p>
            </div>

            <div class="flex justify-end gap-4">
              <!-- Botão Cancelar -->
              <router-link
                to="/settings/content"
                class="px-8 py-4 rounded text-black font-semibold bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                {{ $t('content.homeImages.form.cancel') }}
              </router-link>
              <!-- Botão Adicionar/Atualizar -->
              <button 
                type="submit"
                class="bg-empire-yellow px-8 py-4 rounded text-black font-semibold hover:bg-empire-yellow/90 transition-colors"
                :disabled="loading"
              >
                {{ $t(editingId ? 'content.homeImages.form.update' : 'content.homeImages.form.add') }}
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Imagens -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="(item, index) in homeImages" 
            :key="index"
            class="bg-[#FAFAFA] p-6 md:p-8 rounded-lg relative"
            :class="{ 'opacity-50': !item.is_active }"
          >
            <img 
              :src="item.image_url" 
              :alt="item.title"
              class="w-full h-48 object-cover mb-4 rounded"
            />
            
            <!-- Botões de ação -->
            <div class="absolute top-4 right-4 flex gap-4">
              <button 
                @click="toggleVisibility(index)"
                class="hover:opacity-70 transition-opacity bg-white p-2 rounded-full"
                :title="$t(item.is_active ? 'content.homeImages.actions.hide' : 'content.homeImages.actions.show')"
              >
                <svg 
                  class="w-6 h-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <path v-if="item.is_active" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path v-if="item.is_active" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                  <path v-if="!item.is_active" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line v-if="!item.is_active" x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>

              <button 
                @click="editItem(index)"
                class="hover:opacity-70 transition-opacity bg-white p-2 rounded-full"
                :title="$t('content.homeImages.actions.edit')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              <button 
                @click="showDeleteConfirmation(index)"
                class="hover:opacity-70 transition-opacity bg-white p-2 rounded-full"
                :title="$t('content.homeImages.actions.delete')"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>

            <h2 class="font-archivo-narrow text-2xl text-black mb-2">{{ item.title }}</h2>
            <p class="text-black/70">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 class="text-xl font-archivo-narrow mb-4">{{ $t('content.homeImages.modal.deleteTitle') }}</h3>
        <p class="text-black/70 mb-6">{{ $t('content.homeImages.modal.deleteMessage') }}</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showDeleteModal = false"
            class="px-6 py-2 text-black/70 hover:text-black"
          >
            {{ $t('content.homeImages.modal.cancel') }}
          </button>
          <button 
            @click="confirmDelete"
            class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {{ $t('content.homeImages.modal.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(false)
const homeImages = ref([])
const editingId = ref(null)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const selectedFileName = ref('')
const fileInput = ref(null) // Adicionando a ref do fileInput

const formData = ref({
  title: '',
  description: '',
  image: null,
  is_active: true
})

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    image: null,
    is_active: true
  }
  editingId.value = null
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFileName.value = file.name
    formData.value.image = file
  } else {
    selectedFileName.value = ''
    formData.value.image = null
  }
}

const loadHomeImages = async () => {
  try {
    const response = await api.get('/settings/home-images')
    homeImages.value = response.data
  } catch (error) {
    console.error('Error loading home images:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.value.title)
    formDataToSend.append('description', formData.value.description)
    if (formData.value.image) {
      formDataToSend.append('image', formData.value.image)
    }
    formDataToSend.append('is_active', formData.value.is_active)

    if (editingId.value) {
      await api.put(`/settings/home-images/${editingId.value}`, formDataToSend)
    } else {
      await api.post('/settings/home-images', formDataToSend)
    }

    await loadHomeImages()
    resetForm()
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    loading.value = false
  }
}

const editItem = (index) => {
  const item = homeImages.value[index]
  formData.value = {
    title: item.title,
    description: item.description,
    image: null,
    is_active: item.is_active
  }
  editingId.value = item.id
}

const toggleVisibility = async (index) => {
  const item = homeImages.value[index]
  try {
    await api.patch(`/settings/home-images/${item.id}/toggle`)
    await loadHomeImages()
  } catch (error) {
    console.error('Error toggling visibility:', error)
  }
}

const showDeleteConfirmation = (index) => {
  itemToDelete.value = homeImages.value[index]
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await api.delete(`/settings/home-images/${itemToDelete.value.id}`)
    await loadHomeImages()
    showDeleteModal.value = false
    itemToDelete.value = null
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}

const removeSelectedImage = () => {
  selectedFileName.value = ''
  formData.value.image = null
  if (fileInput.value) {
    fileInput.value.value = '' // Limpa o input file
  }
}

onMounted(() => {
  loadHomeImages()
})
</script>






